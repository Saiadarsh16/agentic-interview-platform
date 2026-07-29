import json
import re
from typing import Any, Protocol, TypedDict

from fastapi import HTTPException, status
from langgraph.graph import END, START, StateGraph
from openai import AsyncOpenAI

from app.core.config import Settings, get_settings
from app.db.models.document import DocumentType
from app.db.models.interview_session import InterviewSession
from app.schemas.question_generation import (
    Competency,
    EvidenceReference,
    GeneratedQuestion,
    QuestionDecision,
    QuestionGenerationRequest,
    QuestionGenerationResponse,
)
from app.schemas.retrieval import RetrievalMatch
from app.services.retrieval import RetrievalService, get_retrieval_service


class JsonLLM(Protocol):
    async def complete(self, *, system: str, payload: dict[str, Any]) -> dict[str, Any]: ...


class OpenAIJsonLLM:
    def __init__(self, settings: Settings) -> None:
        api_key = (
            settings.openai_api_key.get_secret_value().strip()
            if settings.openai_api_key is not None
            else ""
        )
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="An OpenAI API key is required for question generation.",
            )
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = settings.openai_chat_model

    async def complete(self, *, system: str, payload: dict[str, Any]) -> dict[str, Any]:
        response = await self.client.chat.completions.create(
            model=self.model,
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": json.dumps(payload, default=str)},
            ],
        )
        content = response.choices[0].message.content
        if not content:
            raise HTTPException(status_code=502, detail="The question model returned no content.")
        try:
            return json.loads(content)
        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=502,
                detail="The question model returned invalid structured output.",
            ) from exc


class GenerationState(TypedDict, total=False):
    interview: InterviewSession
    request: QuestionGenerationRequest
    context: list[RetrievalMatch]
    competencies: list[Competency]
    candidates: list[dict[str, Any]]
    accepted: list[GeneratedQuestion]
    rejected_count: int
    attempts: int


class QuestionGenerationService:
    def __init__(
        self,
        *,
        settings: Settings,
        retrieval: RetrievalService,
        llm: JsonLLM,
    ) -> None:
        self.settings = settings
        self.retrieval = retrieval
        self.llm = llm
        self.workflow = self._build_workflow()

    def _build_workflow(self):
        graph = StateGraph(GenerationState)
        graph.add_node("retrieve_context", self._retrieve_context)
        graph.add_node("extract_competencies", self._extract_competencies)
        graph.add_node("generate_candidates", self._generate_candidates)
        graph.add_node("evaluate_candidates", self._evaluate_candidates)
        graph.add_edge(START, "retrieve_context")
        graph.add_edge("retrieve_context", "extract_competencies")
        graph.add_edge("extract_competencies", "generate_candidates")
        graph.add_edge("generate_candidates", "evaluate_candidates")
        graph.add_conditional_edges(
            "evaluate_candidates",
            self._next_step,
            {"retry": "generate_candidates", "finish": END},
        )
        return graph.compile()

    async def generate(
        self,
        interview: InterviewSession,
        request: QuestionGenerationRequest,
    ) -> QuestionGenerationResponse:
        result = await self.workflow.ainvoke(
            {
                "interview": interview,
                "request": request,
                "attempts": 0,
                "accepted": [],
                "rejected_count": 0,
            }
        )
        questions = result.get("accepted", [])[: request.question_count]
        if not questions:
            raise HTTPException(
                status_code=422,
                detail="No sufficiently grounded interview questions could be generated.",
            )
        return QuestionGenerationResponse(
            interview_session_id=interview.id,
            job_role=interview.job_role,
            competencies=result["competencies"],
            questions=questions,
            rejected_count=result.get("rejected_count", 0),
            generation_attempts=result.get("attempts", 1),
        )

    async def _retrieve_context(self, state: GenerationState) -> dict[str, Any]:
        interview = state["interview"]
        request = state["request"]
        focus = ", ".join(request.focus_areas) if request.focus_areas else "core requirements"
        query = (
            f"{interview.job_role}; {interview.interview_type}; {interview.difficulty}; "
            f"skills, responsibilities, projects, measurable outcomes, {focus}"
        )
        context = await self.retrieval.search(
            query=query,
            interview_session_id=interview.id,
            document_types=[DocumentType.resume, DocumentType.job_description],
            top_k=self.settings.question_generation_top_k,
        )
        available_types = {match.document_type for match in context}
        required = {DocumentType.resume, DocumentType.job_description}
        if not context or not required.issubset(available_types):
            raise HTTPException(
                status_code=422,
                detail=(
                    "Indexed resume and job-description context are both required "
                    "for personalised question generation."
                ),
            )
        return {"context": context}

    async def _extract_competencies(self, state: GenerationState) -> dict[str, Any]:
        payload = self._base_payload(state)
        output = await self.llm.complete(
            system=(
                "Extract a concise competency matrix for an interview. Use only the supplied "
                "evidence. Return JSON with a 'competencies' array. Each item must contain "
                "name, priority (1-5), jd_requirement, and nullable resume_evidence. Prioritise "
                "JD requirements and identify resume evidence without inventing experience."
            ),
            payload=payload,
        )
        competencies = [Competency.model_validate(item) for item in output["competencies"]]
        if not competencies:
            raise HTTPException(status_code=422, detail="No role competencies were identified.")
        return {"competencies": competencies}

    async def _generate_candidates(self, state: GenerationState) -> dict[str, Any]:
        request = state["request"]
        accepted = state.get("accepted", [])
        remaining = request.question_count - len(accepted)
        output = await self.llm.complete(
            system=(
                "Generate personalised interview questions using only the competency matrix and "
                "numbered evidence chunks. Return JSON with a 'questions' array. Each item must "
                "contain question, competency, question_type, difficulty, rationale, and "
                "evidence_ids. Avoid duplicates and unsupported technologies. Ask seniority-"
                "appropriate trade-off, implementation, scenario, or behavioural questions. "
                "Evidence IDs must refer to the supplied chunks."
            ),
            payload={
                **self._base_payload(state),
                "competencies": [
                    item.model_dump() for item in state["competencies"]
                ],
                "question_count": max(remaining * 2, remaining),
                "already_accepted": [item.question for item in accepted],
                "attempt": state.get("attempts", 0) + 1,
            },
        )
        return {
            "candidates": output.get("questions", []),
            "attempts": state.get("attempts", 0) + 1,
        }

    async def _evaluate_candidates(self, state: GenerationState) -> dict[str, Any]:
        context_by_id = self._context_by_id(state["context"])
        candidates = self._deduplicate(state.get("candidates", []))
        output = await self.llm.complete(
            system=(
                "Act as a strict interview-question evaluator. Score each candidate from 0-100 "
                "for resume_alignment, jd_alignment, role_alignment, specificity, and "
                "answerability. Compute total as 30% resume, 30% JD, 20% role, 10% specificity, "
                "10% answerability. Return JSON with an 'evaluations' array containing "
                "candidate_index, the five scores, total, supported (boolean), and optional "
                "rewritten_question. Mark supported false when evidence does not justify the "
                "question. Rewrite only when grounding is valid but wording needs improvement."
            ),
            payload={
                **self._base_payload(state),
                "candidates": candidates,
            },
        )
        evaluations = {
            int(item["candidate_index"]): item for item in output.get("evaluations", [])
        }
        accepted = list(state.get("accepted", []))
        rejected = state.get("rejected_count", 0)
        existing = {self._normalise(item.question) for item in accepted}
        for index, candidate in enumerate(candidates):
            evaluation = evaluations.get(index)
            if not evaluation or not evaluation.get("supported", False):
                rejected += 1
                continue
            question_text = evaluation.get("rewritten_question") or candidate.get("question", "")
            total = int(evaluation.get("total", 0))
            evidence = self._resolve_evidence(candidate.get("evidence_ids", []), context_by_id)
            if (
                total < self.settings.question_acceptance_score
                or not evidence
                or self._normalise(question_text) in existing
            ):
                rejected += 1
                continue
            generated = GeneratedQuestion.model_validate(
                {
                    **candidate,
                    "question": question_text,
                    "evidence": evidence,
                    "score": evaluation,
                    "decision": (
                        QuestionDecision.rewritten
                        if evaluation.get("rewritten_question")
                        else QuestionDecision.accepted
                    ),
                }
            )
            accepted.append(generated)
            existing.add(self._normalise(question_text))
            if len(accepted) >= state["request"].question_count:
                break
        return {"accepted": accepted, "rejected_count": rejected}

    def _next_step(self, state: GenerationState) -> str:
        enough = len(state.get("accepted", [])) >= state["request"].question_count
        retries_exhausted = state.get("attempts", 0) > self.settings.question_generation_max_retries
        return "finish" if enough or retries_exhausted else "retry"

    def _base_payload(self, state: GenerationState) -> dict[str, Any]:
        interview = state["interview"]
        return {
            "role": interview.job_role,
            "company": interview.company,
            "interview_type": interview.interview_type,
            "difficulty": interview.difficulty,
            "focus_areas": state["request"].focus_areas,
            "evidence": [
                {
                    "evidence_id": str(match.chunk_id),
                    "document_id": str(match.document_id),
                    "document_type": match.document_type.value,
                    "section": match.section,
                    "content": match.content,
                }
                for match in state["context"]
            ],
        }

    @staticmethod
    def _context_by_id(context: list[RetrievalMatch]) -> dict[str, RetrievalMatch]:
        return {str(match.chunk_id): match for match in context}

    @staticmethod
    def _resolve_evidence(
        ids: list[str],
        context: dict[str, RetrievalMatch],
    ) -> list[EvidenceReference]:
        references = []
        for evidence_id in dict.fromkeys(ids):
            match = context.get(str(evidence_id))
            if match is None:
                continue
            references.append(
                EvidenceReference(
                    document_id=match.document_id,
                    chunk_id=match.chunk_id,
                    document_type=match.document_type,
                    excerpt=match.content[:500],
                    relevance=f"Supports the {match.document_type.value} basis for this question.",
                )
            )
        return references

    @classmethod
    def _deduplicate(cls, candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
        unique = []
        seen = set()
        for candidate in candidates:
            key = cls._normalise(str(candidate.get("question", "")))
            if key and key not in seen:
                seen.add(key)
                unique.append(candidate)
        return unique

    @staticmethod
    def _normalise(value: str) -> str:
        return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def get_question_generation_service() -> QuestionGenerationService:
    settings = get_settings()
    return QuestionGenerationService(
        settings=settings,
        retrieval=get_retrieval_service(),
        llm=OpenAIJsonLLM(settings),
    )
