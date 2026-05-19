from __future__ import annotations

import json
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Airport, User
from ..schemas import AirportCreate, AirportOut, AirportUpdate
from ..security import require_admin
from ..utils import airport_to_dict

router = APIRouter()


@router.get("", response_model=list[AirportOut])
def list_airports(session: Session = Depends(get_session)) -> list[AirportOut]:
    rows = session.exec(select(Airport).order_by(Airport.sort_order, Airport.id)).all()
    return [AirportOut(**airport_to_dict(a)) for a in rows]


@router.post("", response_model=AirportOut)
def create_airport(
    payload: AirportCreate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> AirportOut:
    if session.exec(select(Airport).where(Airport.slug == payload.slug)).first():
        raise HTTPException(409, "Slug already exists")
    a = Airport(
        slug=payload.slug,
        name=payload.name,
        short_name=payload.short_name,
        iata=payload.iata,
        city=payload.city,
        distance_miles=payload.distance_miles,
        drive_time_mins=payload.drive_time_mins,
        fare_from=payload.fare_from,
        description=payload.description,
        highlights=json.dumps(payload.highlights),
        is_active=payload.is_active,
        sort_order=payload.sort_order,
    )
    session.add(a)
    session.commit()
    session.refresh(a)
    return AirportOut(**airport_to_dict(a))


@router.patch("/{airport_id}", response_model=AirportOut)
def update_airport(
    airport_id: int,
    payload: AirportUpdate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> AirportOut:
    a = session.get(Airport, airport_id)
    if not a:
        raise HTTPException(404, "Not found")
    data = payload.model_dump(exclude_unset=True)
    if "highlights" in data and data["highlights"] is not None:
        data["highlights"] = json.dumps(data["highlights"])
    for k, val in data.items():
        setattr(a, k, val)
    a.updated_at = datetime.now(UTC)
    session.add(a)
    session.commit()
    session.refresh(a)
    return AirportOut(**airport_to_dict(a))


@router.delete("/{airport_id}")
def delete_airport(
    airport_id: int,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> dict[str, bool]:
    a = session.get(Airport, airport_id)
    if not a:
        raise HTTPException(404, "Not found")
    session.delete(a)
    session.commit()
    return {"ok": True}
