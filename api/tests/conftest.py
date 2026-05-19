from __future__ import annotations

import os
import tempfile
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("JWT_SECRET", "test-secret")


@pytest.fixture
def client() -> Iterator[TestClient]:
    # Use a temp SQLite per-test for isolation
    tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp.close()
    os.environ["DATABASE_URL"] = f"sqlite:///{tmp.name}"

    # Clear cached settings and engine
    from app import config, db

    config.settings = config.Settings()
    db.engine = db._make_engine(config.settings.database_url)  # type: ignore[attr-defined]

    from app.main import app

    with TestClient(app) as c:
        yield c

    try:
        os.unlink(tmp.name)
    except OSError:
        pass


@pytest.fixture
def admin_token(client: TestClient) -> str:
    r = client.post("/auth/login", json={"username": "admin", "password": "admin"})
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture
def auth_headers(admin_token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {admin_token}"}
