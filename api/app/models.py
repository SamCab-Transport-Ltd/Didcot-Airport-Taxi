from __future__ import annotations

from datetime import UTC, datetime

from sqlmodel import Column, Field, SQLModel, Text


def _now() -> datetime:
    return datetime.now(UTC)


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, max_length=80)
    email: str | None = Field(default=None, index=True, max_length=200)
    password_hash: str = Field(max_length=255)
    role: str = Field(default="admin", max_length=20)  # admin | manager | viewer
    is_active: bool = Field(default=True)
    last_login_at: datetime | None = None
    created_at: datetime = Field(default_factory=_now)


class Vehicle(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    code: str = Field(unique=True, index=True, max_length=40)
    name: str = Field(max_length=120)
    tagline: str | None = Field(default=None, max_length=200)
    passengers: int = 4
    luggage: str | None = Field(default=None, max_length=120)
    features: str = Field(default="[]", sa_column=Column(Text))  # JSON array
    multiplier: float = 1.0
    sort_order: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)


class Airport(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True, max_length=80)
    name: str = Field(max_length=160)
    short_name: str = Field(max_length=80)
    iata: str = Field(max_length=4)
    city: str = Field(max_length=80)
    distance_miles: float = 0
    drive_time_mins: int = 0
    fare_from: float = 0
    description: str = Field(default="", sa_column=Column(Text))
    highlights: str = Field(default="[]", sa_column=Column(Text))  # JSON array
    is_active: bool = True
    sort_order: int = 0
    updated_at: datetime = Field(default_factory=_now)


class Area(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True, max_length=80)
    name: str = Field(max_length=120)
    description: str = Field(default="", sa_column=Column(Text))
    postcode_prefixes: str = Field(default="[]", sa_column=Column(Text))  # JSON array
    is_active: bool = True
    sort_order: int = 0
    updated_at: datetime = Field(default_factory=_now)


class FAQ(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    question: str = Field(max_length=400)
    answer: str = Field(sa_column=Column(Text))
    category: str | None = Field(default="general", max_length=40)
    sort_order: int = 0
    is_active: bool = True
    updated_at: datetime = Field(default_factory=_now)


class Driver(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=160)
    phone: str | None = Field(default=None, max_length=40)
    email: str | None = Field(default=None, max_length=200)
    license_number: str | None = Field(default=None, max_length=80)
    vehicle_id: int | None = Field(default=None, foreign_key="vehicle.id")
    is_active: bool = True
    notes: str | None = Field(default=None, sa_column=Column(Text))
    created_at: datetime = Field(default_factory=_now)


class Customer(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=160)
    email: str | None = Field(default=None, index=True, max_length=200)
    phone: str | None = Field(default=None, index=True, max_length=40)
    notes: str | None = Field(default=None, sa_column=Column(Text))
    total_bookings: int = 0
    last_booking_at: datetime | None = None
    created_at: datetime = Field(default_factory=_now)


class Booking(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    reference: str = Field(index=True, unique=True, max_length=20)
    status: str = Field(default="pending", index=True, max_length=20)
    # pending | confirmed | assigned | in_progress | completed | cancelled
    trip_type: str = Field(default="one-way", max_length=20)
    from_location: str = Field(max_length=400)
    to_location: str = Field(max_length=400)
    pickup_at: datetime
    return_at: datetime | None = None
    passengers: int = 1
    luggage: int = 0
    vehicle_code: str | None = Field(default=None, max_length=40)
    flight_number: str | None = Field(default=None, max_length=20)
    meet_greet: bool = False
    notes: str | None = Field(default=None, sa_column=Column(Text))
    customer_id: int | None = Field(default=None, foreign_key="customer.id")
    customer_name: str = Field(max_length=160)
    customer_email: str = Field(max_length=200)
    customer_phone: str = Field(max_length=40)
    driver_id: int | None = Field(default=None, foreign_key="driver.id")
    fare_total: float = 0
    fare_currency: str = "GBP"
    fare_breakdown: str | None = Field(default=None, sa_column=Column(Text))  # JSON
    source: str = Field(default="web", max_length=40)
    created_at: datetime = Field(default_factory=_now, index=True)
    updated_at: datetime = Field(default_factory=_now)


class Setting(SQLModel, table=True):
    key: str = Field(primary_key=True, max_length=80)
    value: str = Field(sa_column=Column(Text))
    updated_at: datetime = Field(default_factory=_now)


class TrackingEvent(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    event: str = Field(index=True, max_length=80)
    params: str = Field(default="{}", sa_column=Column(Text))
    client_id: str | None = Field(default=None, max_length=80)
    ip: str | None = Field(default=None, max_length=64)
    user_agent: str | None = Field(default=None, max_length=400)
    referer: str | None = Field(default=None, max_length=400)
    page: str | None = Field(default=None, max_length=400)
    created_at: datetime = Field(default_factory=_now, index=True)
