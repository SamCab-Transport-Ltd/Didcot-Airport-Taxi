from __future__ import annotations

import json

from sqlmodel import Session, select

from .config import settings
from .models import FAQ, Airport, Area, Setting, User, Vehicle
from .security import hash_password

VEHICLES = [
    {
        "code": "saloon",
        "name": "Standard Saloon",
        "tagline": "Toyota Prius / Skoda Octavia class",
        "passengers": 4,
        "luggage": "2 large, 2 cabin",
        "features": ["Air-con", "Phone charger", "Bottled water"],
        "multiplier": 1.0,
        "sort_order": 1,
    },
    {
        "code": "estate",
        "name": "Estate",
        "tagline": "Skoda Superb Estate / VW Passat",
        "passengers": 4,
        "luggage": "3 large, 3 cabin",
        "features": ["Extra luggage space", "Air-con", "Phone charger"],
        "multiplier": 1.15,
        "sort_order": 2,
    },
    {
        "code": "mpv",
        "name": "MPV 6-Seater",
        "tagline": "VW Caravelle / Ford Galaxy",
        "passengers": 6,
        "luggage": "5 large, 5 cabin",
        "features": ["Spacious cabin", "Child seats available", "Climate zones"],
        "multiplier": 1.35,
        "sort_order": 3,
    },
    {
        "code": "executive",
        "name": "Executive",
        "tagline": "Mercedes E-Class / BMW 5 Series",
        "passengers": 3,
        "luggage": "2 large, 2 cabin",
        "features": ["Leather interior", "On-board Wi-Fi", "Bottled water", "Quiet drive"],
        "multiplier": 1.6,
        "sort_order": 4,
    },
    {
        "code": "8-seater",
        "name": "8-Seater",
        "tagline": "Mercedes Vito / VW Caravelle",
        "passengers": 8,
        "luggage": "8 large bags",
        "features": ["Group travel", "Tour-friendly", "High roof"],
        "multiplier": 1.7,
        "sort_order": 5,
    },
]

AIRPORTS = [
    {
        "slug": "heathrow",
        "name": "London Heathrow Airport",
        "short_name": "Heathrow",
        "iata": "LHR",
        "city": "London",
        "distance_miles": 55,
        "drive_time_mins": 75,
        "fare_from": 85,
    },
    {
        "slug": "gatwick",
        "name": "London Gatwick Airport",
        "short_name": "Gatwick",
        "iata": "LGW",
        "city": "London",
        "distance_miles": 88,
        "drive_time_mins": 105,
        "fare_from": 130,
    },
    {
        "slug": "luton",
        "name": "London Luton Airport",
        "short_name": "Luton",
        "iata": "LTN",
        "city": "London",
        "distance_miles": 60,
        "drive_time_mins": 85,
        "fare_from": 95,
    },
    {
        "slug": "stansted",
        "name": "London Stansted Airport",
        "short_name": "Stansted",
        "iata": "STN",
        "city": "London",
        "distance_miles": 110,
        "drive_time_mins": 130,
        "fare_from": 160,
    },
    {
        "slug": "birmingham",
        "name": "Birmingham Airport",
        "short_name": "Birmingham",
        "iata": "BHX",
        "city": "Birmingham",
        "distance_miles": 80,
        "drive_time_mins": 95,
        "fare_from": 115,
    },
    {
        "slug": "london-city",
        "name": "London City Airport",
        "short_name": "London City",
        "iata": "LCY",
        "city": "London",
        "distance_miles": 80,
        "drive_time_mins": 110,
        "fare_from": 140,
    },
    {
        "slug": "bristol",
        "name": "Bristol Airport",
        "short_name": "Bristol",
        "iata": "BRS",
        "city": "Bristol",
        "distance_miles": 70,
        "drive_time_mins": 85,
        "fare_from": 110,
    },
    {
        "slug": "southampton",
        "name": "Southampton Airport",
        "short_name": "Southampton",
        "iata": "SOU",
        "city": "Southampton",
        "distance_miles": 75,
        "drive_time_mins": 95,
        "fare_from": 115,
    },
    {
        "slug": "manchester",
        "name": "Manchester Airport",
        "short_name": "Manchester",
        "iata": "MAN",
        "city": "Manchester",
        "distance_miles": 175,
        "drive_time_mins": 195,
        "fare_from": 245,
    },
]

AREAS = [
    {
        "slug": "didcot",
        "name": "Didcot",
        "postcode_prefixes": ["OX11"],
        "description": "Our home town. Local pickups across Didcot Parkway, Ladygrove, Northbourne and the town centre.",
    },
    {
        "slug": "abingdon",
        "name": "Abingdon",
        "postcode_prefixes": ["OX14"],
        "description": "Door-to-door airport transfers from Abingdon-on-Thames.",
    },
    {
        "slug": "wallingford",
        "name": "Wallingford",
        "postcode_prefixes": ["OX10"],
        "description": "Premium taxi service for Wallingford — airport runs, long-distance and corporate travel.",
    },
    {
        "slug": "wantage",
        "name": "Wantage",
        "postcode_prefixes": ["OX12"],
        "description": "Reliable Wantage to airport transfers with fixed pricing.",
    },
    {
        "slug": "harwell",
        "name": "Harwell",
        "postcode_prefixes": ["OX11"],
        "description": "Harwell Campus specialists — meet-and-greet on request.",
    },
    {
        "slug": "milton-park",
        "name": "Milton Park",
        "postcode_prefixes": ["OX14"],
        "description": "Business-class transfers for Milton Park companies.",
    },
    {
        "slug": "culham",
        "name": "Culham",
        "postcode_prefixes": ["OX14"],
        "description": "Trusted Culham taxi service for UKAEA and local residents.",
    },
    {
        "slug": "oxford",
        "name": "Oxford",
        "postcode_prefixes": ["OX1", "OX2", "OX3", "OX4"],
        "description": "Oxford to airport transfers with the same fixed-price, premium experience.",
    },
]

FAQS = [
    (
        "Do I need to book in advance?",
        "Pre-booking locks in a fixed price and ensures a vehicle is reserved.",
        "booking",
    ),
    (
        "Is the quoted fare a fixed price?",
        "Every quote is a guaranteed fixed price — no surge, no surprises.",
        "pricing",
    ),
    (
        "Do you track my flight if it is delayed?",
        "Yes — every airport pickup includes live flight tracking with up to 60 minutes of free wait.",
        "airports",
    ),
    (
        "Which payment methods do you accept?",
        "Card online or with the driver, Apple/Google Pay, plus corporate invoicing.",
        "pricing",
    ),
    (
        "Are child seats available?",
        "Yes — infant, child and booster seats are free on request.",
        "booking",
    ),
    (
        "Can I make a return booking?",
        "Absolutely — select 'Return' on the booking form for a discounted second leg.",
        "booking",
    ),
    (
        "What if I need to change or cancel?",
        "Free cancellation up to 12 hours before pickup.",
        "booking",
    ),
]

DEFAULT_SETTINGS: dict[str, object] = {
    "site": {
        "name": "Didcot Airport Taxi",
        "legal_name": "SamCab Transport Ltd.",
        "tagline": "Premium airport & long-distance transfers from Didcot.",
        "url": "https://didcotairporttaxi.co.uk",
    },
    "contact": {
        "phone": "+441235000000",
        "phone_display": "01235 000 000",
        "whatsapp": "+441235000000",
        "email": "bookings@didcotairporttaxi.co.uk",
        "hours": "24/7 · 365 days a year",
    },
    "address": {
        "street": "Didcot",
        "locality": "Didcot",
        "region": "Oxfordshire",
        "postcode": "OX11",
        "country": "GB",
    },
    "social": {
        "facebook": "",
        "instagram": "",
        "x": "",
    },
    "tracking": {
        "ga_id": "",
        "gtm_id": "",
        "meta_pixel_id": "",
        "tiktok_pixel_id": "",
    },
    "branding": {
        "accent_hex": "#FF0000",
        "logo_url": "",
    },
    "pricing": {
        "currency": "GBP",
        "night_surcharge_pct": 10,
        "night_start_hour": 22,
        "night_end_hour": 6,
        "group_surcharge": 15,
        "return_multiplier": 1.85,
        "meet_greet_fee": 10,
    },
}


def seed_initial(session: Session) -> None:
    # Admin
    existing_admin = session.exec(select(User).where(User.role == "admin")).first()
    if not existing_admin:
        admin = User(
            username=settings.seed_admin_username,
            password_hash=hash_password(settings.seed_admin_password),
            role="admin",
            is_active=True,
        )
        session.add(admin)

    # Vehicles
    for v in VEHICLES:
        if not session.exec(select(Vehicle).where(Vehicle.code == v["code"])).first():
            session.add(
                Vehicle(
                    code=v["code"],
                    name=v["name"],
                    tagline=v["tagline"],
                    passengers=v["passengers"],
                    luggage=v["luggage"],
                    features=json.dumps(v["features"]),
                    multiplier=v["multiplier"],
                    sort_order=v["sort_order"],
                    is_active=True,
                )
            )

    # Airports
    for i, a in enumerate(AIRPORTS):
        if not session.exec(select(Airport).where(Airport.slug == a["slug"])).first():
            session.add(
                Airport(
                    slug=a["slug"],
                    name=a["name"],
                    short_name=a["short_name"],
                    iata=a["iata"],
                    city=a["city"],
                    distance_miles=a["distance_miles"],
                    drive_time_mins=a["drive_time_mins"],
                    fare_from=a["fare_from"],
                    description="",
                    highlights=json.dumps([]),
                    is_active=True,
                    sort_order=i,
                )
            )

    # Areas
    for i, a in enumerate(AREAS):
        if not session.exec(select(Area).where(Area.slug == a["slug"])).first():
            session.add(
                Area(
                    slug=a["slug"],
                    name=a["name"],
                    description=a["description"],
                    postcode_prefixes=json.dumps(a["postcode_prefixes"]),
                    sort_order=i,
                    is_active=True,
                )
            )

    # FAQs
    existing_faq_count = len(session.exec(select(FAQ)).all())
    if existing_faq_count == 0:
        for i, (q, ans, cat) in enumerate(FAQS):
            session.add(FAQ(question=q, answer=ans, category=cat, sort_order=i, is_active=True))

    # Settings
    for key, value in DEFAULT_SETTINGS.items():
        if not session.get(Setting, key):
            session.add(Setting(key=key, value=json.dumps(value)))

    session.commit()
