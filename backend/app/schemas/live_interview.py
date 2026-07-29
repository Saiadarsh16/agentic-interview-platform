import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.db.models.interview_session import InterviewStatus
from app.db.models.live_interview import LiveQuestionKind, LiveQuestionStatus


class LiveInterviewStartRequest(BaseModel):
    question_count: int = Field(default=10, ge=1, le=20)
    focus_areas: list[str] = Field(default_factory=list, max_length=10)


class AnswerRequest(BaseModel):
    answer: str = Field(min_length=1, max_length=20000)


class LiveQuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    parent_question_id: uuid.UUID | None
    sequence: int
    kind: LiveQuestionKind
    status: LiveQuestionStatus
    question: str
    competency: str
    question_metadata: dict
    follow_up_count: int
    asked_at: datetime | None
    answered_at: datetime | None


class LiveAnswerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    question_id: uuid.UUID
    answer: str
    created_at: datetime


class LiveInterviewStateResponse(BaseModel):
    interview_session_id: uuid.UUID
    status: InterviewStatus
    current_question: LiveQuestionResponse | None
    questions: list[LiveQuestionResponse]
    answers: list[LiveAnswerResponse]
    answered_count: int
    skipped_count: int
    total_questions: int
    progress_percent: int
