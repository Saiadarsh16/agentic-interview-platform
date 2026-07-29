import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.interview_session import InterviewSession
from app.db.session import get_db
from app.schemas.question_generation import (
    QuestionGenerationRequest,
    QuestionGenerationResponse,
)
from app.services.question_generation import (
    QuestionGenerationService,
    get_question_generation_service,
)

router = APIRouter()
DatabaseSession = Annotated[AsyncSession, Depends(get_db)]
QuestionGenerator = Annotated[
    QuestionGenerationService,
    Depends(get_question_generation_service),
]


@router.post(
    "/{session_id}/questions/generate",
    response_model=QuestionGenerationResponse,
)
async def generate_questions(
    session_id: uuid.UUID,
    payload: QuestionGenerationRequest,
    db: DatabaseSession,
    generator: QuestionGenerator,
) -> QuestionGenerationResponse:
    interview = await db.get(InterviewSession, session_id)
    if interview is None:
        raise HTTPException(status_code=404, detail="Interview session not found.")
    return await generator.generate(interview, payload)
