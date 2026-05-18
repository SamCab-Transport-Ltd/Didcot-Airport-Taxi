import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { airportList } from "@/lib/airports";
import { formatGBP } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Airport Transfers from Didcot",
  description:
    "Fixed-price taxi transfers from Didcot to every major UK airport — Heathrow, Gatwick, Luton, Stansted, Birmingham, Bristol, Manchester and more.",
  alternates: { canonical: "/airports" },
};

export default function AirportsIndex() {
  return (
    <>
      <section className="bg-grid-fade py-16 sm:py-24">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <SectionHeader
                eyebrow="Airport transfers"
                title="Every UK airport, one fixed price."
                description="Pre-bookable, executive-class transfers from Didcot to every major UK airport. Pick your destination below."
              />
            </div>
            <BookingWidget />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="wide">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {airportList.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/airports/${a.slug}`}
                  className="group flex h-full flex-col justify-between rounded-2xl border border-bg-border bg-bg-raised p-6 transition-all hover:border-accent/40"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">{a.iata}</span>
                      <ArrowUpRight className="h-4 w-4 text-ink-muted group-hover:text-accent" />
                    </div>
                    <h2 className="mt-3 font-display text-xl font-semibold">Didcot to {a.shortName}</h2>
                    <p className="mt-2 text-sm text-ink-secondary line-clamp-3">{a.description}</p>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-accent" /> {a.distanceMiles} mi</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-accent" /> ~{a.driveTimeMins} min</span>
                    <span className="font-display text-base font-semibold text-ink-primary">from {formatGBP(a.fareFrom)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
