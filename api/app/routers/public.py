from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

import httpx
from fastapi import APIRouter, Depends, Request
from sqlmodel import Session, or_, select

from ..config import settings as app_settings
from ..db import get_session
from ..models import (
    FAQ,
    Airport,
    Area,
    Booking,
    Customer,
    Setting,
    TrackingEvent,
    Vehicle,
)
from ..schemas import (
    AirportOut,
    AreaOut,
    BookingCreate,
    BookingOut,
    FAQOut,
    TrackEventIn,
    VehicleOut,
)
from ..utils import (
    airport_to_dict,
    area_to_dict,
    booking_to_dict,
    faq_to_dict,
    generate_reference,
    setting_to_dict,
    vehicle_to_dict,
)

router = APIRouter()


def _client_ip(req: Request) -> str:
    xff = req.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return req.client.host if req.client else "0.0.0.0"


@router.get("/vehicles", response_model=list[VehicleOut])
def public_vehicles(session: Session = Depends(get_session)) -> list[VehicleOut]:
    rows = session.exec(
        select(Vehicle).where(Vehicle.is_active.is_(True)).order_by(Vehicle.sort_order, Vehicle.id)
    ).all()
    return [VehicleOut(**vehicle_to_dict(v)) for v in rows]


@router.get("/airports", response_model=list[AirportOut])
def public_airports(session: Session = Depends(get_session)) -> list[AirportOut]:
    rows = session.exec(
        select(Airport).where(Airport.is_active.is_(True)).order_by(Airport.sort_order, Airport.id)
    ).all()
    return [AirportOut(**airport_to_dict(a)) for a in rows]


@router.get("/areas", response_model=list[AreaOut])
def public_areas(session: Session = Depends(get_session)) -> list[AreaOut]:
    rows = session.exec(
        select(Area).where(Area.is_active.is_(True)).order_by(Area.sort_order, Area.id)
    ).all()
    return [AreaOut(**area_to_dict(a)) for a in rows]


@router.get("/faqs", response_model=list[FAQOut])
def public_faqs(session: Session = Depends(get_session)) -> list[FAQOut]:
    rows = session.exec(
        select(FAQ).where(FAQ.is_active.is_(True)).order_by(FAQ.sort_order, FAQ.id)
    ).all()
    return [FAQOut(**faq_to_dict(f)) for f in rows]


@router.get("/settings")
def public_settings(session: Session = Depends(get_session)) -> dict[str, Any]:
    rows = session.exec(select(Setting)).all()
    return {s.key: setting_to_dict(s)["value"] for s in rows}


@router.post("/bookings", response_model=BookingOut)
async def public_create_booking(
    payload: BookingCreate,
    req: Request,
    session: Session = Depends(get_session),
) -> BookingOut:
    customer = session.exec(
        select(Customer).where(
            or_(Customer.email == payload.customer_email, Customer.phone == payload.customer_phone)
        )
    ).first()
    if customer:
        customer.name = payload.customer_name
    else:
        customer = Customer(
            name=payload.customer_name,
            email=payload.customer_email,
            phone=payload.customer_phone,
        )
        session.add(customer)
        session.commit()
        session.refresh(customer)
    customer.total_bookings += 1
    customer.last_booking_at = datetime.now(UTC)
    session.add(customer)

    reference = generate_reference()
    while session.exec(select(Booking).where(Booking.reference == reference)).first():
        reference = generate_reference()

    booking = Booking(
        reference=reference,
        status="pending",
        trip_type=payload.trip_type,
        from_location=payload.from_location,
        to_location=payload.to_location,
        pickup_at=payload.pickup_at,
        return_at=payload.return_at,
        passengers=payload.passengers,
        luggage=payload.luggage,
        vehicle_code=payload.vehicle_code,
        flight_number=payload.flight_number,
        meet_greet=payload.meet_greet,
        notes=payload.notes,
        customer_id=customer.id,
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        customer_phone=payload.customer_phone,
        fare_total=payload.fare_total,
        fare_breakdown=json.dumps(payload.fare_breakdown) if payload.fare_breakdown else None,
        source=payload.source or "web",
    )
    session.add(booking)
    session.commit()
    session.refresh(booking)

    if app_settings.booking_notify_webhook:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                await client.post(
                    app_settings.booking_notify_webhook,
                    json={"booking": booking_to_dict(booking), "ip": _client_ip(req)},
                )
        except Exception:
            pass

    return BookingOut(**booking_to_dict(booking))


@router.post("/track")
async def public_track(
    payload: TrackEventIn,
    req: Request,
    session: Session = Depends(get_session),
) -> dict[str, bool]:
    event = TrackingEvent(
        event=payload.event,
        params=json.dumps(payload.params),
        client_id=payload.client_id,
        ip=_client_ip(req),
        user_agent=req.headers.get("user-agent"),
        referer=req.headers.get("referer"),
        page=payload.page,
    )
    session.add(event)
    session.commit()
    return {"ok": True}
