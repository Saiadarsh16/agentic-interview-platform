from fastapi import APIRouter

from app.api.routes import documents, health, interview_sessions, retrieval

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(
    interview_sessions.router,
    prefix="/interview-sessions",
    tags=["interview sessions"],
)
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(retrieval.router, prefix="/retrieval", tags=["retrieval"])
