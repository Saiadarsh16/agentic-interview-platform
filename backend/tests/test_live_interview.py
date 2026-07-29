import uuid

from fastapi.testclient import TestClient

from app.db.models.interview_session import InterviewStatus
from app.db.models.live_interview import LiveQuestionKind, LiveQuestionStatus
from app.main import app
from app.schemas.live_interview import LiveInterviewStateResponse
from app.services.live_interview import get_live_interview_service


class FakeLiveInterviewService:
    def _state(self, interview, *, status=InterviewStatus.in_progress):
        interview.status = status
        return LiveInterviewStateResponse(
            interview_session_id=interview.id,
            status=status,
            current_question=None,
            questions=[],
            answers=[],
            answered_count=0,
            skipped_count=0,
            total_questions=0,
            progress_percent=0,
        )

    async def start(self, db, interview, payload):
        return self._state(interview)

    async def state(self, db, interview):
        return self._state(interview, status=interview.status)

    async def answer(self, db, interview, question_id, answer):
        return self._state(interview)

    async def skip(self, db, interview, question_id):
        return self._state(interview)

    async def pause(self, db, interview):
        return self._state(interview, status=InterviewStatus.paused)

    async def resume(self, db, interview):
        return self._state(interview)

    async def complete(self, db, interview):
        return self._state(interview, status=InterviewStatus.completed)


def _create_session(client: TestClient) -> str:
    response = client.post(
        "/api/v1/interview-sessions",
        json={
            "job_role": "Senior GenAI Engineer",
            "company": "Example",
            "interview_type": "technical",
            "difficulty": "senior",
            "duration_minutes": 60,
        },
    )
    assert response.status_code == 201
    return response.json()["id"]


def test_live_interview_routes(client: TestClient) -> None:
    app.dependency_overrides[get_live_interview_service] = lambda: FakeLiveInterviewService()
    try:
        session_id = _create_session(client)
        start = client.post(
            f"/api/v1/interview-sessions/{session_id}/live/start",
            json={"question_count": 5},
        )
        assert start.status_code == 200
        assert start.json()["status"] == "in_progress"

        pause = client.post(f"/api/v1/interview-sessions/{session_id}/live/pause")
        assert pause.status_code == 200
        assert pause.json()["status"] == "paused"

        missing = client.get(f"/api/v1/interview-sessions/{uuid.uuid4()}/live")
        assert missing.status_code == 404
    finally:
        app.dependency_overrides.pop(get_live_interview_service, None)


def test_live_question_enums() -> None:
    assert LiveQuestionKind.follow_up == "follow_up"
    assert LiveQuestionStatus.current == "current"
