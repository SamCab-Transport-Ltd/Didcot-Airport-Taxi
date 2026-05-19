from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Driver, User
from ..schemas import DriverCreate, DriverOut, DriverUpdate
from ..security import require_admin
from ..utils import driver_to_dict

router = APIRouter()


@router.get("", response_model=list[DriverOut])
def list_drivers(
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> list[DriverOut]:
    rows = session.exec(select(Driver).order_by(Driver.name)).all()
    return [DriverOut(**driver_to_dict(d)) for d in rows]


@router.post("", response_model=DriverOut)
def create_driver(
    payload: DriverCreate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> DriverOut:
    d = Driver(**payload.model_dump())
    session.add(d)
    session.commit()
    session.refresh(d)
    return DriverOut(**driver_to_dict(d))


@router.patch("/{driver_id}", response_model=DriverOut)
def update_driver(
    driver_id: int,
    payload: DriverUpdate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> DriverOut:
    d = session.get(Driver, driver_id)
    if not d:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(d, k, v)
    session.add(d)
    session.commit()
    session.refresh(d)
    return DriverOut(**driver_to_dict(d))


@router.delete("/{driver_id}")
def delete_driver(
    driver_id: int,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> dict[str, bool]:
    d = session.get(Driver, driver_id)
    if not d:
        raise HTTPException(404, "Not found")
    session.delete(d)
    session.commit()
    return {"ok": True}
