from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..db import get_session
from ..models import Setting, User
from ..schemas import SettingsBulkUpdate, SettingUpdate
from ..security import require_admin
from ..utils import setting_to_dict

router = APIRouter()


@router.get("")
def list_settings(session: Session = Depends(get_session)) -> dict[str, Any]:
    rows = session.exec(select(Setting)).all()
    return {s.key: setting_to_dict(s)["value"] for s in rows}


@router.get("/{key}")
def get_setting(key: str, session: Session = Depends(get_session)) -> dict[str, Any]:
    s = session.get(Setting, key)
    if not s:
        raise HTTPException(404, "Not found")
    return setting_to_dict(s)


@router.patch("/{key}")
def update_setting(
    key: str,
    payload: SettingUpdate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    s = session.get(Setting, key)
    value_json = json.dumps(payload.value)
    if not s:
        s = Setting(key=key, value=value_json)
    else:
        s.value = value_json
        s.updated_at = datetime.now(UTC)
    session.add(s)
    session.commit()
    session.refresh(s)
    return setting_to_dict(s)


@router.put("")
def bulk_update_settings(
    payload: SettingsBulkUpdate,
    _: User = Depends(require_admin),
    session: Session = Depends(get_session),
) -> dict[str, Any]:
    now = datetime.now(UTC)
    for key, value in payload.values.items():
        s = session.get(Setting, key)
        value_json = json.dumps(value)
        if s:
            s.value = value_json
            s.updated_at = now
        else:
            s = Setting(key=key, value=value_json, updated_at=now)
        session.add(s)
    session.commit()
    return list_settings(session)
