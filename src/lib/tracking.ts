declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type TrackEventName =
  | "page_view"
  | "phone_click"
  | "whatsapp_click"
  | "booking_started"
  | "booking_step_completed"
  | "booking_submitted"
  | "fare_estimated"
  | "cta_click";

export interface TrackEvent {
  event: TrackEventName;
  params?: Record<string, unknown>;
}

export function track({ event, params = {} }: TrackEvent): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }

  if (typeof window.fbq === "function") {
    const fbMap: Partial<Record<TrackEventName, string>> = {
      booking_started: "InitiateCheckout",
      booking_step_completed: "AddPaymentInfo",
      booking_submitted: "Purchase",
      phone_click: "Contact",
      whatsapp_click: "Contact",
      fare_estimated: "ViewContent",
    };
    const fbEvent = fbMap[event];
    if (fbEvent) {
      window.fbq("track", fbEvent, params);
    }
  }

  void fetch("/api/track", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ event, params, timestamp: Date.now() }),
    keepalive: true,
  }).catch(() => undefined);
}
