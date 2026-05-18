import { NextResponse, type NextRequest } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sha256(input?: string | null): string | undefined {
  if (!input) return undefined;
  return crypto.createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

interface TrackPayload {
  event?: string;
  params?: Record<string, unknown>;
  timestamp?: number;
}

async function forwardToGA4(event: string, params: Record<string, unknown>, clientId: string) {
  const apiSecret = process.env.GA_API_SECRET;
  const measurementId = process.env.GA_MEASUREMENT_ID;
  if (!apiSecret || !measurementId) return;
  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        body: JSON.stringify({
          client_id: clientId,
          events: [{ name: event.replace(/[^a-zA-Z0-9_]/g, "_"), params }],
        }),
      },
    );
  } catch {}
}

async function forwardToMetaCAPI(
  event: string,
  params: Record<string, unknown>,
  userData: Record<string, unknown>,
  ip: string,
  userAgent: string,
) {
  const token = process.env.META_CAPI_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;
  if (!token || !pixelId) return;
  try {
    const fbMap: Record<string, string> = {
      booking_started: "InitiateCheckout",
      booking_step_completed: "AddPaymentInfo",
      booking_submitted: "Purchase",
      phone_click: "Contact",
      whatsapp_click: "Contact",
    };
    const fbEvent = fbMap[event] || "Lead";
    await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${token}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        data: [
          {
            event_name: fbEvent,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            user_data: {
              client_ip_address: ip,
              client_user_agent: userAgent,
              ...userData,
            },
            custom_data: params,
          },
        ],
      }),
    });
  } catch {}
}

export async function POST(req: NextRequest) {
  let payload: TrackPayload = {};
  try {
    payload = (await req.json()) as TrackPayload;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { event, params = {} } = payload;
  if (!event) return NextResponse.json({ ok: false }, { status: 400 });

  const userAgent = req.headers.get("user-agent") || "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";

  const clientId =
    (req.cookies.get("dtcid")?.value as string | undefined) ||
    crypto.randomBytes(8).toString("hex");

  const userData = {
    em: sha256(params.email as string | undefined),
    ph: sha256((params.phone as string | undefined)?.replace(/\D/g, "")),
  };

  await Promise.all([
    forwardToGA4(event, params, clientId),
    forwardToMetaCAPI(event, params, userData, ip, userAgent),
  ]);

  const res = NextResponse.json({ ok: true });
  if (!req.cookies.get("dtcid")) {
    res.cookies.set("dtcid", clientId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 365 * 2,
      path: "/",
    });
  }
  return res;
}
