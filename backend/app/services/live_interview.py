import uuid
from datetime import UTC, datetime
from typing import Any

from fastapi import HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.db.models.interview_session import InterviewSession, InterviewStatus
from app.db.models.live_interview import (
    InterviewAnswer,
    InterviewQuestion,
    LiveQuestionKind,
    LiveQuestionStatus,
)
from app.schemas.live_interview import LiveInterviewStartRequest, LiveInterviewStateResponse
from app.schemas.question_generation import QuestionGenerationRequest
from app.services.question_generation import (
    JsonLLM,
    OpenAIJsonLLM,
    QuestionGenerationService,
    get_question_generation_service,
)


class LiveInterviewService:
    def __init__(
        self,
        *,
        settings: Settings,
        generator: QuestionGenerationService,
        llm: JsonLLM,
    ) -> None:
        self.settings = settings
        self.generator = generator
        self.llm = llm

    async def start(
        self,
        db: AsyncSession,
        interview: InterviewSession,
        payload: LiveInterviewStartRequest,
    ) -> LiveInterviewStateResponse:
        existing = await db.scalar(
            select(InterviewQuestion.id).where(
                InterviewQuestion.interview_session_id == interview.id
            )
        )
        if existing is not None:
            raise HTTPException(status_code=409, detail="The live interview has already started.")
        if interview.status == InterviewStatus.completed:
            raise HTTPException(status_code=409, detail="A completed interview cannot be restarted.")

        generated = await self.generator.generate(
            interview,
            QuestionGenerationRequest(
                question_count=payload.question_count,
                focus_areas=payload.focus_areas,
            ),
        )
        now = datetime.now(UTC)
        for sequence, item in enumerate(generated.questions, start=1):
            db.add(
                InterviewQuestion(
                    interview_session_id=interview.id,
                    sequence=sequence,
                    kind=LiveQuestionKind.primary,
                    status=(
                        LiveQuestionStatus.current
                        if sequence == 1
                        else LiveQuestionStatus.pending
                    ),
                    question=item.question,
                    competency=item.competency,
                    question_metadata={
                        "question_type": item.question_type,
                        "difficulty": item.difficulty,
                        "rationale": item.rationale,
                        "score": item.score.model_dump(),
                        "evidence": [
                            evidence.model_dump(mode="json") for evidence in item.evidence
                        ],
                    },
                    asked_at=now if sequence == 1 else None,
                )
            )
        interview.status = InterviewStatus.in_progress
        await db.commit()
        return await self.state(db, interview)

    async def state(
        self, db: AsyncSession, interview: InterviewSession
    ) -> LiveInterviewStateResponse:
        questions = list(
            await db.scalars(
                select(InterviewQuestion)
                .where(InterviewQuestion.interview_session_id == interview.id)
                .order_by(InterviewQuestion.sequence)
            )
        )
        answers = list(
            await db.scalars(
                select(InterviewAnswer)
                .where(InterviewAnswer.interview_session_id == interview.id)
                .order_by(InterviewAnswer.created_at)
            )
        )
        answered = sum(item.status == LiveQuestionStatus.answered for item in questions)
        skipped = sum(item.status == LiveQuestionStatus.skipped for item in questions)
        finished = answered + skipped
        total = len(questions)
        current = next(
            (item for item in questions if item.status == LiveQuestionStatus.current), None
        )
        return LiveInterviewStateResponse(
            interview_session_id=interview.id,
            status=interview.status,
            current_question=current,
            questions=questions,
            answers=answers,
            answered_count=answered,
            skipped_count=skipped,
            total_questions=total,
            progress_percent=round(finished * 100 / total) if total else 0,
        )

    async def answer(
        self,
        db: AsyncSession,
        interview: InterviewSession,
        question_id: uuid.UUID,
        answer: str,
    ) -> LiveInterviewStateResponse:
        question = await self._active_question(db, interview, question_id)
        db.add(
            InterviewAnswer(
                interview_session_id=interview.id,
                question_id=question.id,
                answer=answer.strip(),
            )
        )
        question.status = LiveQuestionStatus.answered
        question.answered_at = datetime.now(UTC)

        if (
            question.kind == LiveQuestionKind.primary
            and question.follow_up_count < self.settings.live_interview_max_follow_ups
        ):
            follow_up = await self._generate_follow_up(interview, question, answer)
            if follow_up is not None:
                await db.execute(
                    update(InterviewQuestion)
                    .where(
                        InterviewQuestion.interview_session_id == interview.id,
                        InterviewQuestion.sequence > question.sequence,
                    )
                    .values(sequence=InterviewQuestion.sequence + 1)
                )
                db.add(
                    InterviewQuestion(
                        interview_session_id=interview.id,
                        parent_question_id=question.id,
                        sequence=question.sequence + 1,
                        kind=LiveQuestionKind.follow_up,
                        status=LiveQuestionStatus.pending,
                        question=follow_up["question"],
                        competency=question.competency,
                        question_metadata={"rationale": follow_up.get("rationale", "")},
                    )
                )
                question.follow_up_count += 1
        await self._advance(db, interview)
        await db.commit()
        return await self.state(db, interview)

    async def skip(
        self,
        db: AsyncSession,
        interview: InterviewSession,
        question_id: uuid.UUID,
    ) -> LiveInterviewStateResponse:
        question = await self._active_question(db, interview, question_id)
        question.status = LiveQuestionStatus.skipped
        question.answered_at = datetime.now(UTC)
        await self._advance(db, interview)
        await db.commit()
        return await self.state(db, interview)

    async def pause(
        self, db: AsyncSession, interview: InterviewSession
    ) -> LiveInterviewStateResponse:
        if interview.status != InterviewStatus.in_progress:
            raise HTTPException(status_code=409, detail="Only an active interview can be paused.")
        interview.status = InterviewStatus.paused
        await db.commit()
        return await self.state(db, interview)

    async def resume(
        self, db: AsyncSession, interview: InterviewSession
    ) -> LiveInterviewStateResponse:
        if interview.status != InterviewStatus.paused:
            raise HTTPException(status_code=409, detail="Only a paused interview can be resumed.")
        interview.status = InterviewStatus.in_progress
        await db.commit()
        return await self.state(db, interview)

    async def complete(
        self, db: AsyncSession, interview: InterviewSession
    ) -> LiveInterviewStateResponse:
        if interview.status not in {InterviewStatus.in_progress, InterviewStatus.paused}:
            raise HTTPException(status_code=409, detail="This interview cannot be completed.")
        interview.status = InterviewStatus.completed
        await db.commit()
        return await self.state(db, interview)

    async def _active_question(
        self,
        db: AsyncSession,
        interview: InterviewSession,
        question_id: uuid.UUID,
    ) -> InterviewQuestion:
        if interview.status != InterviewStatus.in_progress:
            raise HTTPException(status_code=409, detail="The interview is not active.")
        question = await db.get(InterviewQuestion, question_id)
        if (
            question is None
            or question.interview_session_id != interview.id
            or question.status != LiveQuestionStatus.current
        ):
            raise HTTPException(status_code=409, detail="The question is not currently active.")
        return question

    async def _advance(self, db: AsyncSession, interview: InterviewSession) -> None:
        next_question = await db.scalar(
            select(InterviewQuestion)
            .where(
                InterviewQuestion.interview_session_id == interview.id,
                InterviewQuestion.status == LiveQuestionStatus.pending,
            )
            .order_by(InterviewQuestion.sequence)
        )
        if next_question is None:
            interview.status = InterviewStatus.completed
            return
        next_question.status = LiveQuestionStatus.current
        next_question.asked_at = datetime.now(UTC)

    async def _generate_follow_up(
        self,
        interview: InterviewSession,
        question: InterviewQuestion,
        answer: str,
    ) -> dict[str, Any] | None:
        result = await self.llm.complete(
            system=(
                "Decide whether one concise follow-up is needed to assess depth, trade-offs, "
                "or measurable impact. Use only the question and candidate answer. Return JSON "
                "with should_follow_up (boolean), question, and rationale. Do not ask for facts "
                "not implied by the original question or answer."
            ),
            payload={
                "role": interview.job_role,
                "difficulty": interview.difficulty,
                "competency": question.competency,
                "question": question.question,
                "answer": answer,
            },
        )
        if not result.get("should_follow_up"):
            return None
        text = str(result.get("question", "")).strip()
        if len(text) < 10:
            return None
        return {"question": text, "rationale": str(result.get("rationale", ""))[:800]}


def get_live_interview_service() -> LiveInterviewService:
    settings = get_settings()
    return LiveInterviewService(
        settings=settings,
        generator=get_question_generation_service(),
        llm=OpenAIJsonLLM(settings),
    )
