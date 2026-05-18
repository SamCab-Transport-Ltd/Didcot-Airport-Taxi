import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book your airport taxi",
  description:
    "Book a premium, fixed-price airport taxi from Didcot. Choose your vehicle, get a live fare estimate, and confirm in seconds.",
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <section className="bg-grid-fade py-12 sm:py-16">
      <Container size="wide">
        <div className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Book your ride
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-5xl">
            Get a fixed-price quote in seconds.
          </h1>
          <p className="mt-3 text-ink-secondary">
            No account needed. Confirm your details, pick your vehicle, and
            we'll handle the rest.
          </p>
        </div>
        <Suspense fallback={<div className="text-ink-muted">Loading…</div>}>
          <BookingFlow />
        </Suspense>
      </Container>
    </section>
  );
}
