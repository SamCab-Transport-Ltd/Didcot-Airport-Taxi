from __future__ import annotations

from fastapi.testclient import TestClient


def test_healthz(client: TestClient) -> None:
    r = client.get("/healthz")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_admin_login_seeds_user(client: TestClient) -> None:
    r = client.post("/auth/login", json={"username": "admin", "password": "admin"})
    assert r.status_code == 200
    body = r.json()
    assert body["token_type"] == "bearer"
    assert body["user"]["username"] == "admin"
    assert body["user"]["role"] == "admin"


def test_admin_login_rejects_wrong_password(client: TestClient) -> None:
    r = client.post("/auth/login", json={"username": "admin", "password": "wrong"})
    assert r.status_code == 401


def test_auth_me_requires_token(client: TestClient) -> None:
    assert client.get("/auth/me").status_code == 401


def test_public_endpoints_have_seed_data(client: TestClient) -> None:
    assert len(client.get("/public/vehicles").json()) == 5
    assert len(client.get("/public/airports").json()) == 9
    assert len(client.get("/public/areas").json()) == 8
    assert len(client.get("/public/faqs").json()) == 7
    s = client.get("/public/settings").json()
    assert "site" in s and "pricing" in s


def test_public_booking_creates_customer_and_returns_reference(client: TestClient) -> None:
    r = client.post(
        "/public/bookings",
        json={
            "trip_type": "one-way",
            "from_location": "Didcot, OX11",
            "to_location": "Heathrow LHR",
            "pickup_at": "2026-12-25T07:30:00Z",
            "passengers": 2,
            "luggage": 2,
            "customer_name": "Jane Doe",
            "customer_email": "jane@example.com",
            "customer_phone": "+447700900111",
            "fare_total": 85.0,
            "vehicle_code": "saloon",
        },
    )
    assert r.status_code == 200, r.text
    b = r.json()
    assert b["reference"].startswith("DAT-")
    assert b["status"] == "pending"
    assert b["customer_name"] == "Jane Doe"


def test_admin_can_list_bookings(client: TestClient, auth_headers: dict[str, str]) -> None:
    client.post(
        "/public/bookings",
        json={
            "trip_type": "one-way",
            "from_location": "Didcot",
            "to_location": "Heathrow",
            "pickup_at": "2026-12-25T07:30:00Z",
            "passengers": 1,
            "customer_name": "Test",
            "customer_email": "t@e.com",
            "customer_phone": "+447700900222",
            "fare_total": 50,
        },
    )
    r = client.get("/bookings", headers=auth_headers)
    assert r.status_code == 200
    assert len(r.json()) >= 1


def test_admin_can_update_booking_status(client: TestClient, auth_headers: dict[str, str]) -> None:
    b = client.post(
        "/public/bookings",
        json={
            "trip_type": "one-way",
            "from_location": "A",
            "to_location": "B",
            "pickup_at": "2026-12-25T07:30:00Z",
            "passengers": 1,
            "customer_name": "Z",
            "customer_email": "z@z.com",
            "customer_phone": "+447700900333",
            "fare_total": 1,
        },
    ).json()
    r = client.patch(
        f"/bookings/{b['id']}",
        json={"status": "confirmed"},
        headers=auth_headers,
    )
    assert r.status_code == 200
    assert r.json()["status"] == "confirmed"


def test_stats_overview(client: TestClient, auth_headers: dict[str, str]) -> None:
    r = client.get("/stats/overview", headers=auth_headers)
    assert r.status_code == 200
    body = r.json()
    assert "bookings_total" in body
    assert len(body["bookings_last_14d"]) == 14


def test_settings_bulk_update(client: TestClient, auth_headers: dict[str, str]) -> None:
    r = client.put(
        "/settings",
        headers=auth_headers,
        json={"values": {"contact": {"phone": "+441000", "email": "a@b.com"}}},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["contact"]["phone"] == "+441000"


def test_tracking_event_round_trip(client: TestClient, auth_headers: dict[str, str]) -> None:
    client.post("/public/track", json={"event": "booking_started", "params": {"step": 0}})
    r = client.get("/tracking/events", headers=auth_headers)
    assert r.status_code == 200
    events = r.json()
    assert any(e["event"] == "booking_started" for e in events)


def test_vehicle_crud_round_trip(client: TestClient, auth_headers: dict[str, str]) -> None:
    created = client.post(
        "/vehicles",
        headers=auth_headers,
        json={
            "code": "limo",
            "name": "Limo",
            "tagline": "Top tier",
            "passengers": 4,
            "luggage": "Lots",
            "features": ["Champagne"],
            "multiplier": 2.5,
            "sort_order": 999,
            "is_active": True,
        },
    )
    assert created.status_code == 200, created.text
    vid = created.json()["id"]
    upd = client.patch(f"/vehicles/{vid}", headers=auth_headers, json={"is_active": False})
    assert upd.status_code == 200
    assert upd.json()["is_active"] is False
    rm = client.delete(f"/vehicles/{vid}", headers=auth_headers)
    assert rm.status_code == 200
