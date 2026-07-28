from fastapi import APIRouter

from app.core.config import get_settings
from app.schemas.health import HealthResponse, ReadinessResponse

router = APIRouter()


@router.get("/live", response_model=HealthResponse)
async def liveness() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        version="0.1.0",
        environment=settings.app_env,
    )


@router.get("/ready", response_model=ReadinessResponse)
async def readiness() -> ReadinessResponse:
    return ReadinessResponse(
        status="ready",
        checks={"api": "ok"},
    )
