import { Star, ShieldCheck, Plane, Timer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-grid-fade pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-noise"
        aria-hidden
      />
      <Container size="wide">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-ring" />
              Premium · Pre-bookable · Fixed price
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Didcot's most trusted{" "}
              <span className="glow-text text-accent">airport taxi</span>{" "}
              service.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg">
              Pre-booked, fixed-price transfers from Didcot to every UK airport.
              Executive vehicles, live flight tracking and a 24/7 dispatch team
              — engineered for travellers who don't compromise.
            </p>

            <ul className="mt-7 grid grid-cols-2 gap-4 text-sm text-ink-secondary sm:max-w-md">
              <Tick icon={<ShieldCheck className="h-4 w-4" />} label="Fixed-price guarantee" />
              <Tick icon={<Plane className="h-4 w-4" />} label="Live flight tracking" />
              <Tick icon={<Timer className="h-4 w-4" />} label="60 min free wait" />
              <Tick icon={<Star className="h-4 w-4" />} label={`${siteConfig.trustpilot.rating}★ from ${siteConfig.trustpilot.reviews}+ trips`} />
            </ul>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <BookingWidget />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Tick({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/30">
        {icon}
      </span>
      <span>{label}</span>
    </li>
  );
}
