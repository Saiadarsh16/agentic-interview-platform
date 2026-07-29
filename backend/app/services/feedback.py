import uuid
from collections import defaultdict
from typing import Any

from fastapi import HTTPException
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.db.models.feedback import AnswerEvaluation, EvaluationStatus, InterviewFeedbackReport
from app.db.models.interview_session import InterviewSession, InterviewStatus
from app.db.models.live_interview import (
    InterviewAnswer,
    InterviewQuestion,
    LiveQuestionStatus,
)
from app.schemas.feedback import AnswerEvaluationResponse, InterviewFeedbackResponse
from app.services.question_generation import JsonLLM, OpenAIJsonLLM

RUBRIC_VERSION = "2026-07-v1"


class FeedbackService:
    def __init__(self, *, settings: Settings, llm: JsonLLM) -> None:
        self.settings = settings
        self.llm = llm

    async def generate(
        self,
        db: AsyncSession,
        interview: InterviewSession,
        *,
        force: bool = False,
    ) -> InterviewFeedbackResponse:
        if interview.status != InterviewStatus.completed:
            raise HTTPException(
                status_code=409,
                detail="Complete the interview before generating final feedback.",
            )

        existing = await db.scalar(
            select(InterviewFeedbackReport).where(
                InterviewFeedbackReport.interview_session_id == interview.id
            )
        )
        if existing is not None and not force:
            return await self._response(db, existing)
        if existing is not None:
            await db.execute(
                delete(AnswerEvaluation).where(
                    AnswerEvaluation.interview_session_id == interview.id
                )
            )
            await db.delete(existing)
            await db.flush()

        rows = (
            await db.execute(
                select(InterviewQuestion, InterviewAnswer)
                .join(InterviewAnswer, InterviewAnswer.question_id == InterviewQuestion.id)
                .where(InterviewQuestion.interview_session_id == interview.id)
                .order_by(InterviewQuestion.sequence)
            )
        ).all()
        if not rows:
            raise HTTPException(status_code=422, detail="No answered questions are available.")

        evaluations: list[AnswerEvaluation] = []
        for question, answer in rows:
            evaluation = await self._evaluate_answer(interview, question, answer)
            db.add(evaluation)
            evaluations.append(evaluation)
        await db.flush()

        skipped_count = int(
            await db.scalar(
                select(InterviewQuestion)
                .where(
                    InterviewQuestion.interview_session_id == interview.id,
                    InterviewQuestion.status == LiveQuestionStatus.skipped,
                )
                .with_only_columns(InterviewQuestion.id)
            )
            is not None
        )
        skipped_count = len(
            list(
                await db.scalars(
                    select(InterviewQuestion.id).where(
                        InterviewQuestion.interview_session_id == interview.id,
                        InterviewQuestion.status == LiveQuestionStatus.skipped,
                    )
                )
            )
        )
        report_data = await self._summarise(interview, rows, evaluations)
        report = InterviewFeedbackReport(
            interview_session_id=interview.id,
            status=EvaluationStatus.completed,
            overall_score=self._average([item.overall_score for item in evaluations]),
            competency_scores=self._competency_scores(rows, evaluations),
            strengths=self._strings(report_data.get("strengths"), limit=8),
            improvement_areas=self._strings(report_data.get("improvement_areas"), limit=8),
            summary=str(report_data.get("summary", "")).strip()[:4000],
            next_steps=self._strings(report_data.get("next_steps"), limit=8),
            answered_questions=len(evaluations),
            skipped_questions=skipped_count,
            evaluator_model=self.settings.openai_chat_model,
            rubric_version=RUBRIC_VERSION,
        )
        db.add(report)
        await db.commit()
        await db.refresh(report)
        return await self._response(db, report)

    async def get(
        self, db: AsyncSession, interview: InterviewSession
    ) -> InterviewFeedbackResponse:
        report = await db.scalar(
            select(InterviewFeedbackReport).where(
                InterviewFeedbackReport.interview_session_id == interview.id
            )
        )
        if report is None:
            raise HTTPException(status_code=404, detail="Feedback has not been generated.")
        return await self._response(db, report)

    async def _evaluate_answer(
        self,
        interview: InterviewSession,
        question: InterviewQuestion,
        answer: InterviewAnswer,
    ) -> AnswerEvaluation:
        question_type = str(question.question_metadata.get("question_type", "technical"))
        rubric_type = "behavioural" if question_type == "behavioural" else "technical"
        evidence = list(question.question_metadata.get("evidence", []))
        result = await self.llm.complete(
            system=(
                "Evaluate one interview answer using only the supplied question, answer, role, "
                "rubric and evidence. Return JSON with integer scores from 0-100 for correctness, "
                "relevance, depth, clarity and grounding; arrays strengths, gaps and "
                "unsupported_claims; and improved_answer. Do not invent candidate experience. "
                "An unsupported claim is a factual experience claim not supported by the answer "
                "or supplied resume/JD evidence. For behavioural answers, prioritise relevance, "
                "specific actions, impact and clarity. For technical answers, prioritise "
                "correctness, trade-offs, implementation depth and grounding."
            ),
            payload={
                "role": interview.job_role,
                "difficulty": interview.difficulty,
                "rubric_type": rubric_type,
                "question": question.question,
                "competency": question.competency,
                "answer": answer.answer,
                "evidence": evidence,
            },
        )
        scores = {
            name: self._score(result.get(name, 0))
            for name in ("correctness", "relevance", "depth", "clarity", "grounding")
        }
        overall = self._weighted_score(rubric_type, scores)
        improved = str(result.get("improved_answer", "")).strip()
        if not improved:
            improved = answer.answer
        return AnswerEvaluation(
            interview_session_id=interview.id,
            question_id=question.id,
            answer_id=answer.id,
            rubric_type=rubric_type,
            overall_score=overall,
            strengths=self._strings(result.get("strengths"), limit=5),
            gaps=self._strings(result.get("gaps"), limit=5),
            unsupported_claims=self._strings(result.get("unsupported_claims"), limit=5),
            improved_answer=improved[:20000],
            evidence=evidence,
            evaluator_model=self.settings.openai_chat_model,
            rubric_version=RUBRIC_VERSION,
            **scores,
        )

    async def _summarise(
        self,
        interview: InterviewSession,
        rows: list[tuple[InterviewQuestion, InterviewAnswer]],
        evaluations: list[AnswerEvaluation],
    ) -> dict[str, Any]:
        result = await self.llm.complete(
            system=(
                "Create a concise final interview coaching report from the supplied per-answer "
                "evaluations. Return JSON with summary, strengths, improvement_areas and "
                "next_steps. Base every observation on the supplied scores and feedback. Do not "
                "invent candidate experience or change numeric scores."
            ),
            payload={
                "role": interview.job_role,
                "difficulty": interview.difficulty,
                "answers": [
                    {
                        "competency": question.competency,
                        "question": question.question,
                        "overall_score": evaluation.overall_score,
                        "strengths": evaluation.strengths,
                        "gaps": evaluation.gaps,
                        "unsupported_claims": evaluation.unsupported_claims,
                    }
                    for (question, _), evaluation in zip(rows, evaluations, strict=True)
                ],
            },
        )
        return result

    async def _response(
        self, db: AsyncSession, report: InterviewFeedbackReport
    ) -> InterviewFeedbackResponse:
        evaluations = list(
            await db.scalars(
                select(AnswerEvaluation)
                .where(AnswerEvaluation.interview_session_id == report.interview_session_id)
                .order_by(AnswerEvaluation.created_at)
            )
        )
        return InterviewFeedbackResponse(
            **{
                column.name: getattr(report, column.name)
                for column in InterviewFeedbackReport.__table__.columns
            },
            answer_evaluations=[AnswerEvaluationResponse.model_validate(item) for item in evaluations],
        )

    @classmethod
    def _competency_scores(
        cls,
        rows: list[tuple[InterviewQuestion, InterviewAnswer]],
        evaluations: list[AnswerEvaluation],
    ) -> dict[str, float]:
        grouped: dict[str, list[float]] = defaultdict(list)
        for (question, _), evaluation in zip(rows, evaluations, strict=True):
            grouped[question.competency].append(evaluation.overall_score)
        return {name: cls._average(scores) for name, scores in grouped.items()}

    @staticmethod
    def _weighted_score(rubric_type: str, scores: dict[str, int]) -> float:
        weights = (
            {"correctness": 0.30, "relevance": 0.20, "depth": 0.25, "clarity": 0.15, "grounding": 0.10}
            if rubric_type == "technical"
            else {"correctness": 0.10, "relevance": 0.30, "depth": 0.25, "clarity": 0.25, "grounding": 0.10}
        )
        return round(sum(scores[name] * weight for name, weight in weights.items()), 1)

    @staticmethod
    def _score(value: Any) -> int:
        try:
            return max(0, min(100, int(value)))
        except (TypeError, ValueError):
            return 0

    @staticmethod
    def _strings(value: Any, *, limit: int) -> list[str]:
        if not isinstance(value, list):
            return []
        return [str(item).strip()[:500] for item in value if str(item).strip()][:limit]

    @staticmethod
    def _average(values: list[float]) -> float:
        return round(sum(values) / len(values), 1) if values else 0.0


def get_feedback_service() -> FeedbackService:
    settings = get_settings()
    return FeedbackService(settings=settings, llm=OpenAIJsonLLM(settings))
