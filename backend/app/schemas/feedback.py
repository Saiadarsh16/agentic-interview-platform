import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.db.models.feedback import EvaluationStatus


class FeedbackGenerateRequest(BaseModel):
    force: bool = False


class AnswerEvaluationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    question_id: uuid.UUID
    answer_id: uuid.UUID
    rubric_type: str
    correctness: int = Field(ge=0, le=100)
    relevance: int = Field(ge=0, le=100)
    depth: int = Field(ge=0, le=100)
    clarity: int = Field(ge=0, le=100)
    grounding: int = Field(ge=0, le=100)
    overall_score: float = Field(ge=0, le=100)
    strengths: list[str]
    gaps: list[str]
    unsupported_claims: list[str]
    improved_answer: str
    evidence: list[dict]
    evaluator_model: str
    rubric_version: str
    created_at: datetime


class InterviewFeedbackResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    interview_session_id: uuid.UUID
    status: EvaluationStatus
    overall_score: float = Field(ge=0, le=100)
    competency_scores: dict[str, float]
    strengths: list[str]
    improvement_areas: list[str]
    summary: str
    next_steps: list[str]
    answered_questions: int
    skipped_questions: int
    evaluator_model: str
    rubric_version: str
    generated_at: datetime
    answer_evaluations: list[AnswerEvaluationResponse]
