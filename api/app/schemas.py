from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class UserPublic(BaseModel):
    id: int
    username: str
    email: str | None = None
    role: str
    is_active: bool


class UserCreate(BaseModel):
    username: str
    email: EmailStr | None = None
    password: str
    role: str = "admin"


# ---------- Vehicle ----------
class VehicleBase(BaseModel):
    code: str
    name: str
    tagline: str | None = None
    passengers: int = 4
    luggage: str | None = None
    features: list[str] = Field(default_factory=list)
    multiplier: float = 1.0
    sort_order: int = 0
    is_active: bool = True


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    name: str | None = None
    tagline: str | None = None
    passengers: int | None = None
    luggage: str | None = None
    features: list[str] | None = None
    multiplier: float | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class VehicleOut(VehicleBase):
    id: int


# ---------- Airport ----------
class AirportBase(BaseModel):
    slug: str
    name: str
    short_name: str
    iata: str
    city: str
    distance_miles: float
    drive_time_mins: int
    fare_from: float
    description: str = ""
    highlights: list[str] = Field(default_factory=list)
    is_active: bool = True
    sort_order: int = 0


class AirportCreate(AirportBase):
    pass


class AirportUpdate(BaseModel):
    name: str | None = None
    short_name: str | None = None
    iata: str | None = None
    city: str | None = None
    distance_miles: float | None = None
    drive_time_mins: int | None = None
    fare_from: float | None = None
    description: str | None = None
    highlights: list[str] | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class AirportOut(AirportBase):
    id: int


# ---------- Area ----------
class AreaBase(BaseModel):
    slug: str
    name: str
    description: str = ""
    postcode_prefixes: list[str] = Field(default_factory=list)
    is_active: bool = True
    sort_order: int = 0


class AreaCreate(AreaBase):
    pass


class AreaUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    postcode_prefixes: list[str] | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class AreaOut(AreaBase):
    id: int


# ---------- FAQ ----------
class FAQBase(BaseModel):
    question: str
    answer: str
    category: str | None = "general"
    sort_order: int = 0
    is_active: bool = True


class FAQCreate(FAQBase):
    pass


class FAQUpdate(BaseModel):
    question: str | None = None
    answer: str | None = None
    category: str | None = None
    sort_order: int | None = None
    is_active: bool | None = None


class FAQOut(FAQBase):
    id: int


# ---------- Driver ----------
class DriverBase(BaseModel):
    name: str
    phone: str | None = None
    email: str | None = None
    license_number: str | None = None
    vehicle_id: int | None = None
    is_active: bool = True
    notes: str | None = None


class DriverCreate(DriverBase):
    pass


class DriverUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    email: str | None = None
    license_number: str | None = None
    vehicle_id: int | None = None
    is_active: bool | None = None
    notes: str | None = None


class DriverOut(DriverBase):
    id: int


# ---------- Customer ----------
class CustomerOut(BaseModel):
    id: int
    name: str
    email: str | None = None
    phone: str | None = None
    notes: str | None = None
    total_bookings: int
    last_booking_at: datetime | None = None
    created_at: datetime


# ---------- Booking ----------
class BookingCreate(BaseModel):
    trip_type: str = "one-way"
    from_location: str
    to_location: str
    pickup_at: datetime
    return_at: datetime | None = None
    passengers: int = 1
    luggage: int = 0
    vehicle_code: str | None = None
    flight_number: str | None = None
    meet_greet: bool = False
    notes: str | None = None
    customer_name: str
    customer_email: str
    customer_phone: str
    fare_total: float = 0
    fare_breakdown: dict[str, Any] | None = None
    source: str = "web"


class BookingUpdate(BaseModel):
    status: str | None = None
    trip_type: str | None = None
    from_location: str | None = None
    to_location: str | None = None
    pickup_at: datetime | None = None
    return_at: datetime | None = None
    passengers: int | None = None
    luggage: int | None = None
    vehicle_code: str | None = None
    flight_number: str | None = None
    meet_greet: bool | None = None
    notes: str | None = None
    customer_name: str | None = None
    customer_email: str | None = None
    customer_phone: str | None = None
    driver_id: int | None = None
    fare_total: float | None = None
    fare_breakdown: dict[str, Any] | None = None


class BookingOut(BaseModel):
    id: int
    reference: str
    status: str
    trip_type: str
    from_location: str
    to_location: str
    pickup_at: datetime
    return_at: datetime | None = None
    passengers: int
    luggage: int
    vehicle_code: str | None = None
    flight_number: str | None = None
    meet_greet: bool
    notes: str | None = None
    customer_id: int | None = None
    customer_name: str
    customer_email: str
    customer_phone: str
    driver_id: int | None = None
    fare_total: float
    fare_currency: str
    fare_breakdown: dict[str, Any] | None = None
    source: str
    created_at: datetime
    updated_at: datetime


# ---------- Settings ----------
class SettingUpdate(BaseModel):
    value: Any


class SettingsBulkUpdate(BaseModel):
    values: dict[str, Any]


# ---------- Tracking ----------
class TrackEventIn(BaseModel):
    event: str
    params: dict[str, Any] = Field(default_factory=dict)
    client_id: str | None = None
    page: str | None = None


class TrackingEventOut(BaseModel):
    id: int
    event: str
    params: dict[str, Any]
    client_id: str | None = None
    ip: str | None = None
    user_agent: str | None = None
    referer: str | None = None
    page: str | None = None
    created_at: datetime


# ---------- Stats ----------
class OverviewStats(BaseModel):
    bookings_today: int
    bookings_week: int
    bookings_total: int
    revenue_today: float
    revenue_week: float
    revenue_total: float
    customers_total: int
    pending_bookings: int
    upcoming_24h: int
    bookings_by_status: dict[str, int]
    bookings_last_14d: list[dict[str, Any]]


TokenResponse.model_rebuild()
