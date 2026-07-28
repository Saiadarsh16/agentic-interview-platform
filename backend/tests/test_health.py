from fastapi.testclient import TestClient

from app.api.routes import health
from app.main import app

client = TestClient(app)


def test_liveness() -> None:
    response = client.get("/api/v1/health/live")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "Agentic Interview Platform API",
        "version": "0.1.0",
        "environment": "development",
    }


def test_readiness(monkeypatch) -> None:
    async def available() -> bool:
        return True

    monkeypatch.setattr(health, "check_database", available)
    monkeypatch.setattr(health, "check_redis", available)
    response = client.get("/api/v1/health/ready")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ready",
        "checks": {"api": "ok", "database": "ok", "redis": "ok"},
    }


def test_readiness_reports_dependency_failure(monkeypatch) -> None:
    async def unavailable() -> bool:
        return False

    monkeypatch.setattr(health, "check_database", unavailable)
    monkeypatch.setattr(health, "check_redis", unavailable)
    response = client.get("/api/v1/health/ready")

    assert response.status_code == 503
    assert response.json()["status"] == "not_ready"


def test_openapi_is_available_outside_production() -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    assert response.json()["info"]["title"] == "Agentic Interview Platform API"
