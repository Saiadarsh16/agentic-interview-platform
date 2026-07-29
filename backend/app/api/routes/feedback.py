import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.interview_session import InterviewSession
from app.db.session import get_db
from app.schemas.feedback import FeedbackGenerateRequest, InterviewFeedbackResponse
from app.services.feedback import FeedbackService, get_feedback_service

router = APIRouter()
DatabaseSession = Annotated[AsyncSession, Depends(get_db)]
Feedback = Annotated[FeedbackService, Depends(get_feedback_service)]


async def _get_interview(db: AsyncSession, session_id: uuid.UUID) -> InterviewSession:
    interview = await db.get(InterviewSession, session_id)
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return interview


@router.post("/{session_id}/feedback/generate", response_model=InterviewFeedbackResponse)
async def generate_feedback(
    session_id: uuid.UUID,
    payload: FeedbackGenerateRequest,
    db: DatabaseSession,
    service: Feedback,
) -> InterviewFeedbackResponse:
    interview = await _get_interview(db, session_id)
    return await service.generate(db, interview, force=payload.force)


@router.get("/{session_id}/feedback", response_model=InterviewFeedbackResponse)
async def get_feedback(
    session_id: uuid.UUID,
    db: DatabaseSession,
    service: Feedback,
) -> InterviewFeedbackResponse:
    interview = await _get_interview(db, session_id)
    return await service.get(db, interview)
