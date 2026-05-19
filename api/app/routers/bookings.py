from __future__ import annotations

import json
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, col, func, or_, select

from ..db import get_session
from ..models import Booking, Customer, User
from ..schemas import BookingCreate, BookingOut, BookingUpdate
from ..security import get_current_user
from ..utils import booking_to_dict, generate_reference

router = APIRouter()

ALLOWED_STATUSES = {
    "pending",
    "confirmed",
    "assigned",
    "in_progress",
    "completed",
    "cancelled",
}


def _upsert_customer(session: Session, name: str, email: str, phone: str) -> Customer:
    customer = session.exec(
        select(Customer).where(or_(Customer.email == email, Customer.phone == phone))
    ).first()
    if customer:
        customer.name = name
        customer.email = email
        customer.phone = phone
    else:
        customer = Customer(name=name, email=email, phone=phone)
        session.add(customer)
        session.commit()
        session.refresh(customer)
    return customer


@router.get("", response_model=list[BookingOut])
def list_bookings(
    status: str | None = Query(default=None),
    q: str | None = Query(default=None),
    limit: int = Query(default=100, le=500),
    offset: int = Query(default=0, ge=0),
    _: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[BookingOut]:
    stmt = select(Booking)
    if status:
        stmt = stmt.where(Booking.status == status)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(
                col(Booking.reference).like(like),
                col(Booking.customer_name).like(like),
                col(Booking.customer_email).like(like),
                col(Booking.customer_phone).like(like),
                col(Booking.from_location).like(like),
                col(Booking.to_location).like(like),
            )
        )
    stmt = stmt.order_by(Booking.created_at.desc()).offset(offset).limit(limit)
    rows = session.exec(stmt).all()
    return [BookingOut(**booking_to_dict(b)) for b in rows]


@router.get("/{booking_id}", response_model=BookingOut)
def get_booking(
    booking_id: int,
    _: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> BookingOut:
    b = session.get(Booking, booking_id)
    if not b:
        raise HTTPException(404, "Not found")
    return BookingOut(**booking_to_dict(b))


@router.post("", response_model=BookingOut)
def create_booking(
    payload: BookingCreate,
    _: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> BookingOut:
    customer = _upsert_customer(
        session, payload.customer_name, payload.customer_email, payload.customer_phone
    )
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
        source=payload.source,
    )
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return BookingOut(**booking_to_dict(booking))


@router.patch("/{booking_id}", response_model=BookingOut)
def update_booking(
    booking_id: int,
    payload: BookingUpdate,
    _: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> BookingOut:
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(404, "Not found")
    data = payload.model_dump(exclude_unset=True)
    if "status" in data and data["status"] not in ALLOWED_STATUSES:
        raise HTTPException(400, f"Invalid status. Must be one of: {sorted(ALLOWED_STATUSES)}")
    if "fare_breakdown" in data and data["fare_breakdown"] is not None:
        data["fare_breakdown"] = json.dumps(data["fare_breakdown"])
    for k, v in data.items():
        setattr(booking, k, v)
    booking.updated_at = datetime.now(UTC)
    session.add(booking)
    session.commit()
    session.refresh(booking)
    return BookingOut(**booking_to_dict(booking))


@router.delete("/{booking_id}")
def delete_booking(
    booking_id: int,
    _: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict[str, bool]:
    b = session.get(Booking, booking_id)
    if not b:
        raise HTTPException(404, "Not found")
    session.delete(b)
    session.commit()
    return {"ok": True}


@router.get("/stats/count")
def bookings_count(
    _: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict[str, int]:
    total = session.exec(select(func.count(Booking.id))).one()
    return {"total": int(total)}
