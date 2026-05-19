from __future__ import annotations

import json
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import User, Vehicle
from ..schemas import VehicleCreate, VehicleOut, VehicleUpdate
from ..security import require_admin
from ..utils import vehicle_to_dict

router = APIRouter()


@router.get("", response_model=list[VehicleOut])
def list_vehicles(session: Session = Depends(get_session)) -> list[VehicleOut]:
    rows = session.exec(select(Vehicle).order_by(Vehicle.sort_order, Vehicle.id)).all()
    return [VehicleOut(**vehicle_to_dict(v)) for v in rows]


@router.post("", response_model=VehicleOut)
def create_vehicle(
    payload: VehicleCreate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> VehicleOut:
    if session.exec(select(Vehicle).where(Vehicle.code == payload.code)).first():
        raise HTTPException(409, "Vehicle code already exists")
    v = Vehicle(
        code=payload.code,
        name=payload.name,
        tagline=payload.tagline,
        passengers=payload.passengers,
        luggage=payload.luggage,
        features=json.dumps(payload.features),
        multiplier=payload.multiplier,
        sort_order=payload.sort_order,
        is_active=payload.is_active,
    )
    session.add(v)
    session.commit()
    session.refresh(v)
    return VehicleOut(**vehicle_to_dict(v))


@router.patch("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(
    vehicle_id: int,
    payload: VehicleUpdate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> VehicleOut:
    v = session.get(Vehicle, vehicle_id)
    if not v:
        raise HTTPException(404, "Not found")
    data = payload.model_dump(exclude_unset=True)
    if "features" in data and data["features"] is not None:
        data["features"] = json.dumps(data["features"])
    for k, val in data.items():
        setattr(v, k, val)
    v.updated_at = datetime.now(UTC)
    session.add(v)
    session.commit()
    session.refresh(v)
    return VehicleOut(**vehicle_to_dict(v))


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> dict[str, bool]:
    v = session.get(Vehicle, vehicle_id)
    if not v:
        raise HTTPException(404, "Not found")
    session.delete(v)
    session.commit()
    return {"ok": True}
