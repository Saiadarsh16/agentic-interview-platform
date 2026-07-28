from fastapi import APIRouter, Response, status

from app.core.config import get_settings
from app.core.redis import check_redis
from app.db.session import check_database
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
async def readiness(response: Response) -> ReadinessResponse:
    database_ok = await check_database()
    redis_ok = await check_redis()
    is_ready = database_ok and redis_ok
    if not is_ready:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return ReadinessResponse(
        status="ready" if is_ready else "not_ready",
        checks={
            "api": "ok",
            "database": "ok" if database_ok else "error",
            "redis": "ok" if redis_ok else "error",
        },
    )
