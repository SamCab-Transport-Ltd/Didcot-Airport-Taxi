from __future__ import annotations

import json
import secrets
import string
from typing import Any

from .models import (
    FAQ,
    Airport,
    Area,
    Booking,
    Driver,
    Setting,
    TrackingEvent,
    User,
    Vehicle,
)


def _parse_json(s: str | None, default: Any) -> Any:
    if not s:
        return default
    try:
        return json.loads(s)
    except json.JSONDecodeError:
        return default


def vehicle_to_dict(v: Vehicle) -> dict[str, Any]:
    return {
        "id": v.id,
        "code": v.code,
        "name": v.name,
        "tagline": v.tagline,
        "passengers": v.passengers,
        "luggage": v.luggage,
        "features": _parse_json(v.features, []),
        "multiplier": v.multiplier,
        "sort_order": v.sort_order,
        "is_active": v.is_active,
    }


def airport_to_dict(a: Airport) -> dict[str, Any]:
    return {
        "id": a.id,
        "slug": a.slug,
        "name": a.name,
        "short_name": a.short_name,
        "iata": a.iata,
        "city": a.city,
        "distance_miles": a.distance_miles,
        "drive_time_mins": a.drive_time_mins,
        "fare_from": a.fare_from,
        "description": a.description,
        "highlights": _parse_json(a.highlights, []),
        "is_active": a.is_active,
        "sort_order": a.sort_order,
    }


def area_to_dict(a: Area) -> dict[str, Any]:
    return {
        "id": a.id,
        "slug": a.slug,
        "name": a.name,
        "description": a.description,
        "postcode_prefixes": _parse_json(a.postcode_prefixes, []),
        "is_active": a.is_active,
        "sort_order": a.sort_order,
    }


def faq_to_dict(f: FAQ) -> dict[str, Any]:
    return {
        "id": f.id,
        "question": f.question,
        "answer": f.answer,
        "category": f.category,
        "sort_order": f.sort_order,
        "is_active": f.is_active,
    }


def driver_to_dict(d: Driver) -> dict[str, Any]:
    return {
        "id": d.id,
        "name": d.name,
        "phone": d.phone,
        "email": d.email,
        "license_number": d.license_number,
        "vehicle_id": d.vehicle_id,
        "is_active": d.is_active,
        "notes": d.notes,
    }


def booking_to_dict(b: Booking) -> dict[str, Any]:
    return {
        "id": b.id,
        "reference": b.reference,
        "status": b.status,
        "trip_type": b.trip_type,
        "from_location": b.from_location,
        "to_location": b.to_location,
        "pickup_at": b.pickup_at,
        "return_at": b.return_at,
        "passengers": b.passengers,
        "luggage": b.luggage,
        "vehicle_code": b.vehicle_code,
        "flight_number": b.flight_number,
        "meet_greet": b.meet_greet,
        "notes": b.notes,
        "customer_id": b.customer_id,
        "customer_name": b.customer_name,
        "customer_email": b.customer_email,
        "customer_phone": b.customer_phone,
        "driver_id": b.driver_id,
        "fare_total": b.fare_total,
        "fare_currency": b.fare_currency,
        "fare_breakdown": _parse_json(b.fare_breakdown, None),
        "source": b.source,
        "created_at": b.created_at,
        "updated_at": b.updated_at,
    }


def setting_to_dict(s: Setting) -> dict[str, Any]:
    return {"key": s.key, "value": _parse_json(s.value, None), "updated_at": s.updated_at}


def tracking_event_to_dict(t: TrackingEvent) -> dict[str, Any]:
    return {
        "id": t.id,
        "event": t.event,
        "params": _parse_json(t.params, {}),
        "client_id": t.client_id,
        "ip": t.ip,
        "user_agent": t.user_agent,
        "referer": t.referer,
        "page": t.page,
        "created_at": t.created_at,
    }


def user_to_public(u: User) -> dict[str, Any]:
    return {
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "role": u.role,
        "is_active": u.is_active,
    }


def generate_reference() -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "DAT-" + "".join(secrets.choice(alphabet) for _ in range(6))
