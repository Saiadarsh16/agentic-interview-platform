import uuid
from datetime import UTC, datetime
from enum import StrEnum

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class EvaluationStatus(StrEnum):
    pending = "pending"
    completed = "completed"
    failed = "failed"


class AnswerEvaluation(Base):
    __tablename__ = "answer_evaluations"
    __table_args__ = (UniqueConstraint("answer_id", name="uq_answer_evaluations_answer_id"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    interview_session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("interview_sessions.id", ondelete="CASCADE"), index=True
    )
    question_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("interview_questions.id", ondelete="CASCADE"), index=True
    )
    answer_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("interview_answers.id", ondelete="CASCADE"), index=True
    )
    rubric_type: Mapped[str] = mapped_column(String(30))
    correctness: Mapped[int] = mapped_column(Integer)
    relevance: Mapped[int] = mapped_column(Integer)
    depth: Mapped[int] = mapped_column(Integer)
    clarity: Mapped[int] = mapped_column(Integer)
    grounding: Mapped[int] = mapped_column(Integer)
    overall_score: Mapped[float] = mapped_column(Float)
    strengths: Mapped[list] = mapped_column(JSON, default=list)
    gaps: Mapped[list] = mapped_column(JSON, default=list)
    unsupported_claims: Mapped[list] = mapped_column(JSON, default=list)
    improved_answer: Mapped[str] = mapped_column(Text)
    evidence: Mapped[list] = mapped_column(JSON, default=list)
    evaluator_model: Mapped[str] = mapped_column(String(120))
    rubric_version: Mapped[str] = mapped_column(String(40))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )


class InterviewFeedbackReport(Base):
    __tablename__ = "interview_feedback_reports"
    __table_args__ = (
        UniqueConstraint("interview_session_id", name="uq_feedback_report_session"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    interview_session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("interview_sessions.id", ondelete="CASCADE"), index=True
    )
    status: Mapped[EvaluationStatus] = mapped_column(
        String(20), default=EvaluationStatus.pending
    )
    overall_score: Mapped[float] = mapped_column(Float)
    competency_scores: Mapped[dict] = mapped_column(JSON, default=dict)
    strengths: Mapped[list] = mapped_column(JSON, default=list)
    improvement_areas: Mapped[list] = mapped_column(JSON, default=list)
    summary: Mapped[str] = mapped_column(Text)
    next_steps: Mapped[list] = mapped_column(JSON, default=list)
    answered_questions: Mapped[int] = mapped_column(Integer)
    skipped_questions: Mapped[int] = mapped_column(Integer)
    evaluator_model: Mapped[str] = mapped_column(String(120))
    rubric_version: Mapped[str] = mapped_column(String(40))
    generated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
