import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.db.models.interview_session import InterviewStatus


class InterviewSessionCreate(BaseModel):
    job_role: str = Field(min_length=2, max_length=160)
    company: str | None = Field(default=None, max_length=160)
    interview_type: str = Field(min_length=2, max_length=80)
    difficulty: str = Field(min_length=2, max_length=40)
    duration_minutes: int = Field(ge=5, le=180)


class InterviewSessionUpdate(BaseModel):
    company: str | None = Field(default=None, max_length=160)
    status: InterviewStatus | None = None


class InterviewSessionResponse(InterviewSessionCreate):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: InterviewStatus
    created_at: datetime
    updated_at: datetime
