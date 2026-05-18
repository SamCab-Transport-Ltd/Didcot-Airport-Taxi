# Didcot Airport Taxi

Premium, SEO-first frontend for **Didcot Airport Taxi**, trading as **SamCab Transport Ltd.** — an automated airport taxi booking platform serving Didcot, Oxfordshire and the surrounding area.

## Stack

- **Next.js 14** (App Router, TypeScript) — SSR + static generation for top-tier SEO.
- **Tailwind CSS** with a custom dark theme + restrained `#FF0000` accent.
- **React Hook Form + Zod** for the multi-step booking flow.
- **Framer Motion** for premium micro-interactions.
- **next-sitemap** for sitemap + robots.txt generation.

## Highlights

- **Premium dark UI** with a single, sparing accent (`#FF0000`) reserved for primary CTAs and focus rings.
- **Multi-step booking flow** with live fare estimate, vehicle selection, flight number capture and contact details — all kept on a single `/book` page.
- **Per-airport landing pages** (`/airports/[slug]`) with `TaxiService`, `LocalBusiness`, `FAQPage` and `BreadcrumbList` JSON-LD for rich results.
- **Per-area landing pages** (`/areas/[slug]`) for local SEO across Oxfordshire.
- **Server-side tracking** at `/api/track` that forwards to GA4 Measurement Protocol and Meta Conversion API with hashed PII — driven via env vars.
- **Booking webhook** at `/api/booking` ready to forward to email/CRM endpoints.

## Local development

```bash
npm install
cp .env.example .env.local   # add tracking/webhook secrets as needed
npm run dev                   # http://localhost:3000
```

## Useful scripts

- `npm run dev` — start the local dev server on port 3000.
- `npm run build` — production build.
- `npm run start` — start the production server.
- `npm run lint` — Next.js ESLint config.
- `npm run typecheck` — strict TypeScript checking.

## Environment variables

See `.env.example` — supports GA4, GTM, Meta Pixel + Meta Conversion API, TikTok pixel/CAPI, and a booking webhook URL. All public variables use the `NEXT_PUBLIC_` prefix; server-side secrets are kept off the bundle.

## SEO & AI search

- `sitemap.xml` and `robots.txt` are generated automatically by Next.js metadata routes.
- Every page declares canonical, OG, Twitter and (where applicable) JSON-LD structured data.
- FAQ pages are wrapped in `FAQPage` schema, ideal for Google AI overviews and rich snippets.
- Airport and area landing pages target high-intent local + transactional keywords.

## License

© SamCab Transport Ltd. All rights reserved.
