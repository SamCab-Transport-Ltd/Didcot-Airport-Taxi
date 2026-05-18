import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const webhook = process.env.BOOKING_WEBHOOK_URL;
  const notifyEmail = process.env.BOOKING_NOTIFY_EMAIL;
  const ua = req.headers.get("user-agent") || "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";

  const payload = {
    ...body,
    meta: { ua, ip, receivedAt: new Date().toISOString() },
  };

  // Best-effort forward — never block the user if the webhook is unset.
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}
  }

  // Log to console so the operator can pick it up in server logs as a fallback.
  // (Avoid logging full PII in production logging systems.)
  if (process.env.NODE_ENV !== "production") {
    console.info("[booking]", JSON.stringify(payload));
  }

  return NextResponse.json({ ok: true, notifyEmail: Boolean(notifyEmail) });
}
