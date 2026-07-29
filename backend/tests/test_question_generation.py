import uuid

from fastapi.testclient import TestClient

from app.core.config import Settings
from app.db.models.document import DocumentType
from app.db.models.interview_session import InterviewSession
from app.main import app
from app.schemas.question_generation import (
    AlignmentScore,
    Competency,
    EvidenceReference,
    GeneratedQuestion,
    QuestionDecision,
    QuestionGenerationRequest,
    QuestionGenerationResponse,
    QuestionType,
)
from app.schemas.retrieval import RetrievalMatch
from app.services.question_generation import (
    QuestionGenerationService,
    get_question_generation_service,
)


class FakeQuestionGenerator:
    async def generate(self, interview, payload) -> QuestionGenerationResponse:
        return QuestionGenerationResponse(
            interview_session_id=interview.id,
            job_role=interview.job_role,
            competencies=[
                Competency(
                    name="Agent orchestration",
                    priority=5,
                    jd_requirement="Build multi-agent workflows.",
                    resume_evidence="Built LangGraph workflows.",
                )
            ],
            questions=[
                GeneratedQuestion(
                    question="How did you manage state across your LangGraph agents?",
                    competency="Agent orchestration",
                    question_type=QuestionType.technical,
                    difficulty=interview.difficulty,
                    rationale="Tests a required skill supported by the resume.",
                    evidence=[
                        EvidenceReference(
                            document_id=uuid.uuid4(),
                            chunk_id=uuid.uuid4(),
                            document_type=DocumentType.resume,
                            excerpt="Built LangGraph workflows.",
                            relevance="Resume evidence.",
                        )
                    ],
                    score=AlignmentScore(
                        resume_alignment=95,
                        jd_alignment=90,
                        role_alignment=90,
                        specificity=90,
                        answerability=95,
                        total=92,
                    ),
                    decision=QuestionDecision.accepted,
                )
            ],
            rejected_count=0,
            generation_attempts=1,
        )


class FakeRetrieval:
    def __init__(self) -> None:
        self.resume_chunk = uuid.uuid4()
        self.jd_chunk = uuid.uuid4()

    async def search(self, **kwargs) -> list[RetrievalMatch]:
        return [
            RetrievalMatch(
                chunk_id=self.resume_chunk,
                document_id=uuid.uuid4(),
                document_type=DocumentType.resume,
                score=0.94,
                content="Built production LangGraph workflows.",
                section="Experience",
                sequence=0,
            ),
            RetrievalMatch(
                chunk_id=self.jd_chunk,
                document_id=uuid.uuid4(),
                document_type=DocumentType.job_description,
                score=0.92,
                content="Design and scale multi-agent workflows.",
                section="Requirements",
                sequence=0,
            ),
        ]


class SequencedLLM:
    def __init__(self, retrieval: FakeRetrieval) -> None:
        self.retrieval = retrieval
        self.calls = 0

    async def complete(self, *, system, payload):
        self.calls += 1
        if self.calls == 1:
            return {
                "competencies": [
                    {
                        "name": "Agent orchestration",
                        "priority": 5,
                        "jd_requirement": "Design multi-agent workflows.",
                        "resume_evidence": "Built production LangGraph workflows.",
                    }
                ]
            }
        if self.calls == 2:
            return {
                "questions": [
                    {
                        "question": "What Kubernetes operator did you build?",
                        "competency": "Agent orchestration",
                        "question_type": "technical",
                        "difficulty": "senior",
                        "rationale": "Candidate question.",
                        "evidence_ids": [str(self.retrieval.resume_chunk)],
                    }
                ]
            }
        if self.calls == 3:
            return {
                "evaluations": [
                    {
                        "candidate_index": 0,
                        "resume_alignment": 10,
                        "jd_alignment": 10,
                        "role_alignment": 50,
                        "specificity": 60,
                        "answerability": 10,
                        "total": 22,
                        "supported": False,
                    }
                ]
            }
        if self.calls == 4:
            return {
                "questions": [
                    {
                        "question": "How did you manage state across your LangGraph agents?",
                        "competency": "Agent orchestration",
                        "question_type": "technical",
                        "difficulty": "senior",
                        "rationale": "Tests an evidenced role requirement.",
                        "evidence_ids": [
                            str(self.retrieval.resume_chunk),
                            str(self.retrieval.jd_chunk),
                        ],
                    }
                ]
            }
        return {
            "evaluations": [
                {
                    "candidate_index": 0,
                    "resume_alignment": 95,
                    "jd_alignment": 95,
                    "role_alignment": 90,
                    "specificity": 90,
                    "answerability": 95,
                    "total": 94,
                    "supported": True,
                }
            ]
        }


def _create_session(client: TestClient) -> str:
    response = client.post(
        "/api/v1/interview-sessions",
        json={
            "job_role": "Senior GenAI Engineer",
            "company": "Example",
            "interview_type": "technical",
            "difficulty": "senior",
            "duration_minutes": 60,
        },
    )
    assert response.status_code == 201
    return response.json()["id"]


def test_generate_questions_endpoint(client: TestClient) -> None:
    app.dependency_overrides[get_question_generation_service] = (
        lambda: FakeQuestionGenerator()
    )
    try:
        session_id = _create_session(client)
        response = client.post(
            f"/api/v1/interview-sessions/{session_id}/questions/generate",
            json={"question_count": 1},
        )
        assert response.status_code == 200
        assert response.json()["questions"][0]["score"]["total"] == 92
        assert response.json()["questions"][0]["evidence"]
    finally:
        app.dependency_overrides.pop(get_question_generation_service, None)


def test_generate_questions_for_missing_session(client: TestClient) -> None:
    app.dependency_overrides[get_question_generation_service] = (
        lambda: FakeQuestionGenerator()
    )
    try:
        response = client.post(
            f"/api/v1/interview-sessions/{uuid.uuid4()}/questions/generate",
            json={"question_count": 1},
        )
        assert response.status_code == 404
    finally:
        app.dependency_overrides.pop(get_question_generation_service, None)


async def test_workflow_rejects_unsupported_question_and_retries() -> None:
    retrieval = FakeRetrieval()
    llm = SequencedLLM(retrieval)
    service = QuestionGenerationService(
        settings=Settings(
            app_env="test",
            question_generation_max_retries=1,
            question_acceptance_score=80,
        ),
        retrieval=retrieval,
        llm=llm,
    )
    interview = InterviewSession(
        id=uuid.uuid4(),
        job_role="Senior GenAI Engineer",
        company="Example",
        interview_type="technical",
        difficulty="senior",
        duration_minutes=60,
    )

    result = await service.generate(
        interview,
        QuestionGenerationRequest(question_count=1),
    )

    assert result.generation_attempts == 2
    assert result.rejected_count == 1
    assert result.questions[0].score.total == 94
    assert len(result.questions[0].evidence) == 2
