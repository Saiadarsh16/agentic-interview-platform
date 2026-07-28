from fastapi import APIRouter

from app.api.routes import health, interview_sessions

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(
    interview_sessions.router,
    prefix="/interview-sessions",
    tags=["interview sessions"],
)
