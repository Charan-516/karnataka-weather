import time
import threading

sessions: dict[str, dict] = {}
_lock = threading.Lock()


def create_session(session_id: str, district: str) -> dict:
    cleanup_old_sessions()
    with _lock:
        session = {
            "session_id": session_id,
            "district": district,
            "status": "waiting",
            "sensor_data": None,
            "prediction": None,
            "created_at": time.time(),
            "updated_at": time.time(),
        }
        sessions[session_id] = session
        return session


def update_sensor_data(session_id: str, data: dict) -> dict | None:
    with _lock:
        session = sessions.get(session_id)
        if not session:
            return None
        session["sensor_data"] = data
        session["status"] = "received"
        session["updated_at"] = time.time()
        return session


def set_prediction(session_id: str, prediction: dict) -> bool:
    with _lock:
        session = sessions.get(session_id)
        if not session:
            return False
        session["prediction"] = prediction
        session["status"] = "completed"
        session["updated_at"] = time.time()
        return True


def get_session(session_id: str) -> dict | None:
    with _lock:
        session = sessions.get(session_id)
        if session:
            return dict(session)
        return None


def cleanup_old_sessions(max_age: int = 300):
    now = time.time()
    with _lock:
        expired = [
            sid for sid, s in sessions.items()
            if now - s.get("updated_at", 0) > max_age
        ]
        for sid in expired:
            del sessions[sid]
