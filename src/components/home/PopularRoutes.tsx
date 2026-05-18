import Link from "next/link";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { airportList } from "@/lib/airports";
import { formatGBP } from "@/lib/utils";

export function PopularRoutes() {
  return (
    <section className="border-y border-bg-border bg-bg-raised py-20 sm:py-24">
      <Container size="wide">
        <div className="flex items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Popular routes"
            title="Direct transfers to every major UK airport."
            description="Fixed prices, premium vehicles, and a service tuned for the route — whether you're heading to Heathrow at dawn or Manchester for a long-haul."
          />
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {airportList.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/airports/${a.slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-bg-border bg-bg-surface p-6 transition-all hover:border-accent/50"
              >
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                      {a.iata}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-ink-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold text-ink-primary">
                    Didcot to {a.shortName}
                  </h3>
                  <p className="mt-2 text-sm text-ink-secondary line-clamp-2">
                    {a.description}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-accent" /> {a.distanceMiles} mi
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-accent" /> ~{a.driveTimeMins} min
                  </span>
                  <span className="font-display text-base font-semibold text-ink-primary">
                    from {formatGBP(a.fareFrom)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
