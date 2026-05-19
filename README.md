# Didcot Airport Taxi

Premium, SEO-first booking platform for **Didcot Airport Taxi**, trading as **SamCab Transport Ltd.** — serving Didcot, Oxfordshire and the surrounding area.

## Project layout

```
.
├── src/                    # Public-facing Next.js 14 site (root of repo)
├── admin/                  # Operator dashboard — Next.js 14 (port 3001)
└── api/                    # FastAPI backend + SQLite (port 8000)
```

Three services that work together. The public site (`/`) talks to the FastAPI
backend through its own Next.js API routes (`/api/booking`, `/api/track`), and
the admin dashboard at `admin.<your-domain>` talks to the backend directly.

## Stack

- **Public site (`src/`)** — Next.js 14 (App Router, TS), Tailwind, React Hook Form + Zod, Framer Motion, `next-sitemap`.
- **Admin dashboard (`admin/`)** — Next.js 14 (App Router, TS), Tailwind, SWR, Recharts, JWT-based auth.
- **Backend API (`api/`)** — FastAPI, SQLModel, SQLite (Postgres-ready), JWT, bcrypt, `pytest` + `ruff`.

## Highlights

- **Premium dark UI** with a single, sparing accent (`#FF0000`) reserved for primary CTAs and focus rings.
- **Multi-step booking flow** with live fare estimate, vehicle selection, flight number capture and contact details — all kept on a single `/book` page.
- **Per-airport landing pages** (`/airports/[slug]`) with `TaxiService`, `LocalBusiness`, `FAQPage` and `BreadcrumbList` JSON-LD for rich results.
- **Per-area landing pages** (`/areas/[slug]`) for local SEO across Oxfordshire.
- **Server-side tracking** at `/api/track` that forwards to GA4 Measurement Protocol and Meta Conversion API with hashed PII — driven via env vars.
- **Booking webhook** at `/api/booking` ready to forward to email/CRM endpoints.

## Local development

Run all three services in parallel (in three terminals).

```bash
# 1) Backend API (FastAPI, port 8000)
cd api
uv venv .venv && source .venv/bin/activate     # or: python -m venv .venv
uv pip install -e ".[dev]"                     # or: pip install -e ".[dev]"
cp .env.example .env                           # rotate JWT_SECRET before prod
uvicorn app.main:app --reload --port 8000

# 2) Public site (Next.js, port 3000)
npm install
cp .env.example .env.local                     # set BACKEND_API_URL=http://localhost:8000
npm run dev

# 3) Admin dashboard (Next.js, port 3001)
cd admin
npm install
cp .env.example .env.local                     # set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Then sign into the admin dashboard at <http://localhost:3001/login> with
`admin / admin`. **Rotate this immediately** in Settings → Users & access.

## Useful scripts

Public site (run from repo root):

- `npm run dev` — dev server on port 3000.
- `npm run build` / `npm run start` — production build + serve.
- `npm run lint` / `npm run typecheck`.

Admin dashboard (run from `admin/`):

- `npm run dev` — dev server on port 3001.
- `npm run build` / `npm run start` — production build + serve.
- `npm run lint` / `npm run typecheck`.

Backend (run from `api/`):

- `uvicorn app.main:app --reload` — dev server on port 8000.
- `pytest -q` — API test suite.
- `ruff check . && ruff format .` — lint + format.

## Deployment topology

- `didcotairporttaxi.co.uk` → public site (Next.js, port 3000).
- `admin.didcotairporttaxi.co.uk` → admin dashboard (Next.js, port 3001). The
  app sets `X-Robots-Tag: noindex, nofollow` and `X-Frame-Options: DENY` so
  the dashboard is never indexed.
- `api.didcotairporttaxi.co.uk` → FastAPI backend (port 8000). Lock down with
  TLS + `API_CORS_ORIGINS` listing only the two front-facing hosts.

## Environment variables

See `.env.example` — supports GA4, GTM, Meta Pixel + Meta Conversion API, TikTok pixel/CAPI, and a booking webhook URL. All public variables use the `NEXT_PUBLIC_` prefix; server-side secrets are kept off the bundle.

## SEO & AI search

- `sitemap.xml` and `robots.txt` are generated automatically by Next.js metadata routes.
- Every page declares canonical, OG, Twitter and (where applicable) JSON-LD structured data.
- FAQ pages are wrapped in `FAQPage` schema, ideal for Google AI overviews and rich snippets.
- Airport and area landing pages target high-intent local + transactional keywords.

## License

© SamCab Transport Ltd. All rights reserved.
