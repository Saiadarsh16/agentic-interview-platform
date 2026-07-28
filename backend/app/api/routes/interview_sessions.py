import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.interview_session import InterviewSession
from app.db.session import get_db
from app.schemas.interview_session import (
    InterviewSessionCreate,
    InterviewSessionResponse,
    InterviewSessionUpdate,
)

router = APIRouter()
DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


@router.post("", response_model=InterviewSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_interview_session(
    payload: InterviewSessionCreate,
    db: DatabaseSession,
) -> InterviewSession:
    interview = InterviewSession(**payload.model_dump())
    db.add(interview)
    await db.commit()
    await db.refresh(interview)
    return interview


@router.get("", response_model=list[InterviewSessionResponse])
async def list_interview_sessions(
    db: DatabaseSession,
) -> list[InterviewSession]:
    result = await db.scalars(
        select(InterviewSession).order_by(InterviewSession.created_at.desc())
    )
    return list(result)


@router.get("/{session_id}", response_model=InterviewSessionResponse)
async def get_interview_session(
    session_id: uuid.UUID,
    db: DatabaseSession,
) -> InterviewSession:
    interview = await db.get(InterviewSession, session_id)
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return interview


@router.patch("/{session_id}", response_model=InterviewSessionResponse)
async def update_interview_session(
    session_id: uuid.UUID,
    payload: InterviewSessionUpdate,
    db: DatabaseSession,
) -> InterviewSession:
    interview = await db.get(InterviewSession, session_id)
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(interview, field, value)
    await db.commit()
    await db.refresh(interview)
    return interview
