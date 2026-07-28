from collections.abc import AsyncIterator, Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.db.session import Base, get_db
from app.main import app

engine = create_async_engine(
    "sqlite+aiosqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
SessionFactory = async_sessionmaker(engine, expire_on_commit=False)


async def override_get_db() -> AsyncIterator[AsyncSession]:
    async with SessionFactory() as session:
        yield session


@pytest.fixture(autouse=True)
async def database() -> AsyncIterator[None]:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)


@pytest.fixture
def client() -> Iterator[TestClient]:
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_interview_session_crud(client: TestClient) -> None:
    create_response = client.post(
        "/api/v1/interview-sessions",
        json={
            "job_role": "Senior Generative AI Engineer",
            "company": "Example Corp",
            "interview_type": "Technical",
            "difficulty": "Senior",
            "duration_minutes": 45,
        },
    )
    assert create_response.status_code == 201
    session_id = create_response.json()["id"]
    assert create_response.json()["status"] == "planned"

    list_response = client.get("/api/v1/interview-sessions")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    update_response = client.patch(
        f"/api/v1/interview-sessions/{session_id}",
        json={"status": "in_progress"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "in_progress"

    get_response = client.get(f"/api/v1/interview-sessions/{session_id}")
    assert get_response.status_code == 200
    assert get_response.json()["job_role"] == "Senior Generative AI Engineer"


def test_missing_interview_session_returns_404(client: TestClient) -> None:
    response = client.get("/api/v1/interview-sessions/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
