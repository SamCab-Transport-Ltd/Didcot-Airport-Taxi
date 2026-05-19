from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, col, select

from ..db import get_session
from ..models import TrackingEvent, User
from ..schemas import TrackingEventOut
from ..security import require_admin
from ..utils import tracking_event_to_dict

router = APIRouter()


@router.get("/events", response_model=list[TrackingEventOut])
def list_events(
    event: str | None = Query(default=None),
    limit: int = Query(default=200, le=1000),
    offset: int = Query(default=0, ge=0),
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> list[TrackingEventOut]:
    stmt = select(TrackingEvent)
    if event:
        stmt = stmt.where(col(TrackingEvent.event) == event)
    stmt = stmt.order_by(TrackingEvent.created_at.desc()).offset(offset).limit(limit)
    rows = session.exec(stmt).all()
    return [TrackingEventOut(**tracking_event_to_dict(t)) for t in rows]


@router.delete("/events")
def clear_events(
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> dict[str, int]:
    rows = session.exec(select(TrackingEvent)).all()
    n = len(rows)
    for r in rows:
        session.delete(r)
    session.commit()
    return {"deleted": n}
