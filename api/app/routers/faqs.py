from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import FAQ, User
from ..schemas import FAQCreate, FAQOut, FAQUpdate
from ..security import require_admin
from ..utils import faq_to_dict

router = APIRouter()


@router.get("", response_model=list[FAQOut])
def list_faqs(session: Session = Depends(get_session)) -> list[FAQOut]:
    rows = session.exec(select(FAQ).order_by(FAQ.sort_order, FAQ.id)).all()
    return [FAQOut(**faq_to_dict(f)) for f in rows]


@router.post("", response_model=FAQOut)
def create_faq(
    payload: FAQCreate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> FAQOut:
    f = FAQ(**payload.model_dump())
    session.add(f)
    session.commit()
    session.refresh(f)
    return FAQOut(**faq_to_dict(f))


@router.patch("/{faq_id}", response_model=FAQOut)
def update_faq(
    faq_id: int,
    payload: FAQUpdate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> FAQOut:
    f = session.get(FAQ, faq_id)
    if not f:
        raise HTTPException(404, "Not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(f, k, v)
    f.updated_at = datetime.now(UTC)
    session.add(f)
    session.commit()
    session.refresh(f)
    return FAQOut(**faq_to_dict(f))


@router.delete("/{faq_id}")
def delete_faq(
    faq_id: int,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> dict[str, bool]:
    f = session.get(FAQ, faq_id)
    if not f:
        raise HTTPException(404, "Not found")
    session.delete(f)
    session.commit()
    return {"ok": True}
