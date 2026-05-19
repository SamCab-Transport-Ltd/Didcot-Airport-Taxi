from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import User
from ..schemas import UserCreate, UserPublic
from ..security import hash_password, require_admin
from ..utils import user_to_public

router = APIRouter()


@router.get("", response_model=list[UserPublic])
def list_users(
    _: User = Depends(require_admin), session: Session = Depends(get_session)
) -> list[UserPublic]:
    return [UserPublic(**user_to_public(u)) for u in session.exec(select(User)).all()]


@router.post("", response_model=UserPublic)
def create_user(
    payload: UserCreate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> UserPublic:
    if session.exec(select(User).where(User.username == payload.username)).first():
        raise HTTPException(409, "Username already exists")
    user = User(
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return UserPublic(**user_to_public(user))


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    current: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> dict[str, bool]:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(404, "Not found")
    if user.id == current.id:
        raise HTTPException(400, "Cannot delete yourself")
    session.delete(user)
    session.commit()
    return {"ok": True}
