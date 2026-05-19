from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..db import get_session
from ..models import User
from ..schemas import LoginRequest, TokenResponse, UserPublic
from ..security import create_access_token, get_current_user, verify_password
from ..utils import user_to_public

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)) -> TokenResponse:
    user = session.exec(select(User).where(User.username == payload.username)).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account disabled")

    user.last_login_at = datetime.now(UTC)
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token(user.username, {"role": user.role})
    return TokenResponse(access_token=token, user=UserPublic(**user_to_public(user)))


@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)) -> UserPublic:
    return UserPublic(**user_to_public(user))
