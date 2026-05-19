from __future__ import annotations

import json
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Area, User
from ..schemas import AreaCreate, AreaOut, AreaUpdate
from ..security import require_admin
from ..utils import area_to_dict

router = APIRouter()


@router.get("", response_model=list[AreaOut])
def list_areas(session: Session = Depends(get_session)) -> list[AreaOut]:
    rows = session.exec(select(Area).order_by(Area.sort_order, Area.id)).all()
    return [AreaOut(**area_to_dict(a)) for a in rows]


@router.post("", response_model=AreaOut)
def create_area(
    payload: AreaCreate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> AreaOut:
    if session.exec(select(Area).where(Area.slug == payload.slug)).first():
        raise HTTPException(409, "Slug already exists")
    a = Area(
        slug=payload.slug,
        name=payload.name,
        description=payload.description,
        postcode_prefixes=json.dumps(payload.postcode_prefixes),
        is_active=payload.is_active,
        sort_order=payload.sort_order,
    )
    session.add(a)
    session.commit()
    session.refresh(a)
    return AreaOut(**area_to_dict(a))


@router.patch("/{area_id}", response_model=AreaOut)
def update_area(
    area_id: int,
    payload: AreaUpdate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> AreaOut:
    a = session.get(Area, area_id)
    if not a:
        raise HTTPException(404, "Not found")
    data = payload.model_dump(exclude_unset=True)
    if "postcode_prefixes" in data and data["postcode_prefixes"] is not None:
        data["postcode_prefixes"] = json.dumps(data["postcode_prefixes"])
    for k, val in data.items():
        setattr(a, k, val)
    a.updated_at = datetime.now(UTC)
    session.add(a)
    session.commit()
    session.refresh(a)
    return AreaOut(**area_to_dict(a))


@router.delete("/{area_id}")
def delete_area(
    area_id: int,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> dict[str, bool]:
    a = session.get(Area, area_id)
    if not a:
        raise HTTPException(404, "Not found")
    session.delete(a)
    session.commit()
    return {"ok": True}
