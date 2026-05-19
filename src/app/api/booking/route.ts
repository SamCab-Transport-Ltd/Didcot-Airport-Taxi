import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface IncomingBooking {
  tripType?: string;
  from?: string;
  to?: string;
  pickupAt?: string;
  returnAt?: string;
  passengers?: number;
  luggage?: number;
  vehicleId?: string;
  flightNumber?: string;
  meetGreet?: boolean;
  notes?: string;
  name?: string;
  email?: string;
  phone?: string;
  fare?: { total?: number; base?: number; surcharge?: number; estimatedMiles?: number; estimatedMins?: number };
  [k: string]: unknown;
}

export async function POST(req: NextRequest) {
  let body: IncomingBooking = {};
  try {
    body = (await req.json()) as IncomingBooking;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const webhook = process.env.BOOKING_WEBHOOK_URL;
  const apiUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
  const ua = req.headers.get("user-agent") || "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";

  let reference: string | null = null;
  let apiOk = false;

  if (apiUrl) {
    try {
      const apiPayload = {
        trip_type: body.tripType ?? "one-way",
        from_location: body.from ?? "",
        to_location: body.to ?? "",
        pickup_at: body.pickupAt
          ? new Date(body.pickupAt).toISOString()
          : new Date().toISOString(),
        return_at: body.returnAt ? new Date(body.returnAt).toISOString() : null,
        passengers: body.passengers ?? 1,
        luggage: body.luggage ?? 0,
        vehicle_code: body.vehicleId ?? null,
        flight_number: body.flightNumber ?? null,
        meet_greet: Boolean(body.meetGreet),
        notes: body.notes ?? null,
        customer_name: body.name ?? "",
        customer_email: body.email ?? "",
        customer_phone: body.phone ?? "",
        fare_total: body.fare?.total ?? 0,
        fare_breakdown: body.fare ?? null,
        source: "web",
      };
      const res = await fetch(`${apiUrl.replace(/\/$/, "")}/public/bookings`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(apiPayload),
      });
      if (res.ok) {
        const data = (await res.json()) as { reference?: string };
        reference = data.reference ?? null;
        apiOk = true;
      }
    } catch {
      /* swallow — fall back to webhook below */
    }
  }

  const payload = {
    ...body,
    reference,
    meta: { ua, ip, receivedAt: new Date().toISOString() },
  };

  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* noop */
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[booking]", JSON.stringify(payload));
  }

  return NextResponse.json({ ok: true, reference, persisted: apiOk });
}
