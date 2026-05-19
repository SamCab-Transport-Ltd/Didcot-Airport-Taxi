from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from . import db as db_module
from .config import settings
from .db import init_db
from .routers import (
    airports,
    areas,
    auth,
    bookings,
    customers,
    drivers,
    faqs,
    public,
    stats,
    tracking,
    users,
    vehicles,
)
from .routers import (
    settings as settings_router,
)
from .seed import seed_initial


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    with Session(db_module.engine) as session:
        seed_initial(session)
    yield


app = FastAPI(
    title="Didcot Airport Taxi API",
    description="Backend API for managing bookings, fleet, content and tracking for didcotairporttaxi.co.uk",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["meta"])
def root() -> dict[str, str]:
    return {"name": "Didcot Airport Taxi API", "version": "0.1.0"}


@app.get("/healthz", tags=["meta"])
def healthz() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(public.router, prefix="/public", tags=["public"])
app.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
app.include_router(customers.router, prefix="/customers", tags=["customers"])
app.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
app.include_router(airports.router, prefix="/airports", tags=["airports"])
app.include_router(areas.router, prefix="/areas", tags=["areas"])
app.include_router(faqs.router, prefix="/faqs", tags=["faqs"])
app.include_router(drivers.router, prefix="/drivers", tags=["drivers"])
app.include_router(settings_router.router, prefix="/settings", tags=["settings"])
app.include_router(tracking.router, prefix="/tracking", tags=["tracking"])
app.include_router(stats.router, prefix="/stats", tags=["stats"])
app.include_router(users.router, prefix="/users", tags=["users"])
