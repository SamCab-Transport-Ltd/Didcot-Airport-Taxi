from __future__ import annotations

from collections import Counter
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends
from sqlmodel import Session, func, select

from ..db import get_session
from ..models import Booking, Customer, User
from ..schemas import OverviewStats
from ..security import get_current_user

router = APIRouter()


@router.get("/overview", response_model=OverviewStats)
def overview(
    _: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> OverviewStats:
    now = datetime.now(UTC)
    start_of_day = datetime(now.year, now.month, now.day, tzinfo=UTC)
    week_ago = start_of_day - timedelta(days=6)
    two_weeks_ago = start_of_day - timedelta(days=13)

    all_bookings = session.exec(select(Booking)).all()

    def _to_utc(dt: datetime) -> datetime:
        return dt if dt.tzinfo else dt.replace(tzinfo=UTC)

    bookings_today = [b for b in all_bookings if _to_utc(b.created_at) >= start_of_day]
    bookings_week = [b for b in all_bookings if _to_utc(b.created_at) >= week_ago]
    upcoming_24h_cutoff = now + timedelta(hours=24)
    upcoming_24h = [
        b
        for b in all_bookings
        if _to_utc(b.pickup_at) >= now
        and _to_utc(b.pickup_at) <= upcoming_24h_cutoff
        and b.status not in {"cancelled", "completed"}
    ]
    pending = [b for b in all_bookings if b.status == "pending"]

    by_status = Counter(b.status for b in all_bookings)

    # 14-day chart
    series: list[dict[str, object]] = []
    for i in range(14):
        day = (two_weeks_ago + timedelta(days=i)).date()
        day_start = datetime(day.year, day.month, day.day, tzinfo=UTC)
        day_end = day_start + timedelta(days=1)
        day_bookings = [b for b in all_bookings if day_start <= _to_utc(b.created_at) < day_end]
        series.append(
            {
                "date": day.isoformat(),
                "bookings": len(day_bookings),
                "revenue": float(sum(b.fare_total for b in day_bookings)),
            }
        )

    customers_total = int(session.exec(select(func.count(Customer.id))).one())

    return OverviewStats(
        bookings_today=len(bookings_today),
        bookings_week=len(bookings_week),
        bookings_total=len(all_bookings),
        revenue_today=float(sum(b.fare_total for b in bookings_today)),
        revenue_week=float(sum(b.fare_total for b in bookings_week)),
        revenue_total=float(sum(b.fare_total for b in all_bookings)),
        customers_total=customers_total,
        pending_bookings=len(pending),
        upcoming_24h=len(upcoming_24h),
        bookings_by_status=dict(by_status),
        bookings_last_14d=series,
    )
