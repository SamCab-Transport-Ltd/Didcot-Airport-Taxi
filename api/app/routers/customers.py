from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Customer, User
from ..schemas import CustomerOut
from ..security import require_admin

router = APIRouter()


@router.get("", response_model=list[CustomerOut])
def list_customers(
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> list[CustomerOut]:
    rows = session.exec(select(Customer).order_by(Customer.last_booking_at.desc())).all()
    return [CustomerOut.model_validate(c, from_attributes=True) for c in rows]


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(
    customer_id: int,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> CustomerOut:
    c = session.get(Customer, customer_id)
    if not c:
        raise HTTPException(404, "Not found")
    return CustomerOut.model_validate(c, from_attributes=True)


@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> dict[str, bool]:
    c = session.get(Customer, customer_id)
    if not c:
        raise HTTPException(404, "Not found")
    session.delete(c)
    session.commit()
    return {"ok": True}
