import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.interview_session import InterviewSession
from app.db.session import get_db
from app.schemas.live_interview import (
    AnswerRequest,
    LiveInterviewStartRequest,
    LiveInterviewStateResponse,
)
from app.services.live_interview import LiveInterviewService, get_live_interview_service

router = APIRouter()
DatabaseSession = Annotated[AsyncSession, Depends(get_db)]
LiveInterview = Annotated[LiveInterviewService, Depends(get_live_interview_service)]


async def _get_interview(db: AsyncSession, session_id: uuid.UUID) -> InterviewSession:
    interview = await db.get(InterviewSession, session_id)
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return interview


@router.post("/{session_id}/live/start", response_model=LiveInterviewStateResponse)
async def start_live_interview(
    session_id: uuid.UUID,
    payload: LiveInterviewStartRequest,
    db: DatabaseSession,
    service: LiveInterview,
) -> LiveInterviewStateResponse:
    return await service.start(db, await _get_interview(db, session_id), payload)


@router.get("/{session_id}/live", response_model=LiveInterviewStateResponse)
async def get_live_interview(
    session_id: uuid.UUID,
    db: DatabaseSession,
    service: LiveInterview,
) -> LiveInterviewStateResponse:
    return await service.state(db, await _get_interview(db, session_id))


@router.post(
    "/{session_id}/live/questions/{question_id}/answer",
    response_model=LiveInterviewStateResponse,
)
async def answer_live_question(
    session_id: uuid.UUID,
    question_id: uuid.UUID,
    payload: AnswerRequest,
    db: DatabaseSession,
    service: LiveInterview,
) -> LiveInterviewStateResponse:
    return await service.answer(
        db, await _get_interview(db, session_id), question_id, payload.answer
    )


@router.post(
    "/{session_id}/live/questions/{question_id}/skip",
    response_model=LiveInterviewStateResponse,
)
async def skip_live_question(
    session_id: uuid.UUID,
    question_id: uuid.UUID,
    db: DatabaseSession,
    service: LiveInterview,
) -> LiveInterviewStateResponse:
    return await service.skip(db, await _get_interview(db, session_id), question_id)


@router.post("/{session_id}/live/pause", response_model=LiveInterviewStateResponse)
async def pause_live_interview(
    session_id: uuid.UUID,
    db: DatabaseSession,
    service: LiveInterview,
) -> LiveInterviewStateResponse:
    return await service.pause(db, await _get_interview(db, session_id))


@router.post("/{session_id}/live/resume", response_model=LiveInterviewStateResponse)
async def resume_live_interview(
    session_id: uuid.UUID,
    db: DatabaseSession,
    service: LiveInterview,
) -> LiveInterviewStateResponse:
    return await service.resume(db, await _get_interview(db, session_id))


@router.post("/{session_id}/live/complete", response_model=LiveInterviewStateResponse)
async def complete_live_interview(
    session_id: uuid.UUID,
    db: DatabaseSession,
    service: LiveInterview,
) -> LiveInterviewStateResponse:
    return await service.complete(db, await _get_interview(db, session_id))
