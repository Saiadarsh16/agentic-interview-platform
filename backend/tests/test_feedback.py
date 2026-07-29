import uuid
from datetime import UTC, datetime

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.db.models.feedback import EvaluationStatus
from app.db.models.interview_session import InterviewSession, InterviewStatus
from app.db.models.live_interview import InterviewAnswer, InterviewQuestion
from app.main import app
from app.schemas.feedback import InterviewFeedbackResponse
from app.services.feedback import FeedbackService, get_feedback_service


class FakeJsonLLM:
    async def complete(self, *, system, payload):
        return {
            "correctness": 80,
            "relevance": 90,
            "depth": 70,
            "clarity": 85,
            "grounding": 75,
            "strengths": ["Clear implementation explanation"],
            "gaps": ["Add a measurable result"],
            "unsupported_claims": [],
            "improved_answer": "A stronger evidence-grounded answer.",
        }


class FakeFeedbackService:
    async def generate(self, db, interview, *, force=False):
        return self._response(interview)

    async def get(self, db, interview):
        return self._response(interview)

    @staticmethod
    def _response(interview):
        return InterviewFeedbackResponse(
            id=uuid.uuid4(),
            interview_session_id=interview.id,
            status=EvaluationStatus.completed,
            overall_score=82.5,
            competency_scores={"RAG": 82.5},
            strengths=["Strong grounding"],
            improvement_areas=["Quantify impact"],
            summary="A grounded performance with room for deeper metrics.",
            next_steps=["Practise one metric-led answer"],
            answered_questions=1,
            skipped_questions=0,
            evaluator_model="fake-model",
            rubric_version="test-v1",
            generated_at=datetime.now(UTC),
            answer_evaluations=[],
        )


def _create_completed_session(client: TestClient) -> str:
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


def test_feedback_routes(client: TestClient) -> None:
    app.dependency_overrides[get_feedback_service] = lambda: FakeFeedbackService()
    try:
        session_id = _create_completed_session(client)
        generated = client.post(
            f"/api/v1/interview-sessions/{session_id}/feedback/generate",
            json={"force": False},
        )
        assert generated.status_code == 200
        assert generated.json()["overall_score"] == 82.5

        fetched = client.get(f"/api/v1/interview-sessions/{session_id}/feedback")
        assert fetched.status_code == 200
        assert fetched.json()["competency_scores"] == {"RAG": 82.5}
    finally:
        app.dependency_overrides.pop(get_feedback_service, None)


@pytest.mark.asyncio
async def test_answer_evaluation_uses_technical_rubric_without_provider_calls() -> None:
    service = FeedbackService(settings=Settings(openai_chat_model="fake-model"), llm=FakeJsonLLM())
    interview = InterviewSession(
        id=uuid.uuid4(),
        job_role="Senior GenAI Engineer",
        interview_type="technical",
        difficulty="senior",
        duration_minutes=60,
        status=InterviewStatus.completed,
    )
    question = InterviewQuestion(
        id=uuid.uuid4(),
        interview_session_id=interview.id,
        sequence=1,
        kind="primary",
        status="answered",
        question="How did you design your RAG retrieval strategy?",
        competency="RAG",
        question_metadata={"question_type": "technical", "evidence": []},
        follow_up_count=0,
    )
    answer = InterviewAnswer(
        id=uuid.uuid4(),
        interview_session_id=interview.id,
        question_id=question.id,
        answer="I used metadata filters and reranking to improve relevance.",
    )

    evaluation = await service._evaluate_answer(interview, question, answer)

    assert evaluation.rubric_type == "technical"
    assert evaluation.overall_score == 79.0
    assert evaluation.unsupported_claims == []
    assert evaluation.evaluator_model == "fake-model"
