"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Plane, Calendar, Users, Plus, Minus, ShieldCheck } from "lucide-react";
import { airportList } from "@/lib/airports";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/tracking";
import { cn } from "@/lib/utils";

type TripType = "one-way" | "return" | "hourly";

const popularPickups = [
  "Didcot Parkway Station",
  "Didcot Town Centre",
  "Harwell Campus",
  "Milton Park",
  "Abingdon",
  "Wantage",
  "Wallingford",
  "Oxford",
];

function formatDateForInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export function BookingWidget({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>("one-way");
  const [from, setFrom] = useState("Didcot Parkway Station");
  const [to, setTo] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [pickup, setPickup] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 3, 0, 0, 0);
    return formatDateForInput(d);
  });
  const [touched, setTouched] = useState(false);

  const airportSuggestions = useMemo(() => airportList.slice(0, 6), []);

  const valid = from.trim().length > 1 && to.trim().length > 1 && pickup;

  function startBooking() {
    setTouched(true);
    if (!valid) return;
    track({
      event: "booking_started",
      params: { tripType, from, to, passengers, pickup },
    });
    const params = new URLSearchParams({
      type: tripType,
      from,
      to,
      passengers: String(passengers),
      pickup,
    });
    router.push(`/book?${params.toString()}`);
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-bg-border bg-bg-raised/90 p-5 shadow-card sm:p-7",
        compact ? "" : "backdrop-blur-xl",
      )}
    >
      <div className="absolute inset-0 -z-10 bg-red-fade opacity-60" aria-hidden />
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <TripTab active={tripType === "one-way"} onClick={() => setTripType("one-way")}>
          One-way
        </TripTab>
        <TripTab active={tripType === "return"} onClick={() => setTripType("return")}>
          Return
        </TripTab>
        <TripTab active={tripType === "hourly"} onClick={() => setTripType("hourly")}>
          Hourly
        </TripTab>
        <span className="ml-auto hidden items-center gap-1.5 text-xs text-ink-muted sm:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Fixed-price guarantee
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field
          icon={<MapPin className="h-4 w-4" />}
          label="Pickup"
          value={from}
          onChange={setFrom}
          placeholder="Address, postcode or station"
          list="pickup-options"
          error={touched && !from.trim() ? "Required" : undefined}
        />
        <datalist id="pickup-options">
          {popularPickups.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>

        <Field
          icon={<Plane className="h-4 w-4" />}
          label="Destination"
          value={to}
          onChange={setTo}
          placeholder="Airport, address or postcode"
          list="dest-options"
          error={touched && !to.trim() ? "Required" : undefined}
        />
        <datalist id="dest-options">
          {airportSuggestions.map((a) => (
            <option key={a.slug} value={`${a.shortName} Airport (${a.iata})`} />
          ))}
        </datalist>

        <DateField value={pickup} onChange={setPickup} />

        <PassengerField value={passengers} onChange={setPassengers} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {airportSuggestions.slice(0, 4).map((a) => (
          <button
            key={a.slug}
            type="button"
            onClick={() => setTo(`${a.shortName} Airport (${a.iata})`)}
            className="rounded-full border border-bg-border bg-bg-surface px-3 py-1.5 text-xs text-ink-secondary transition-colors hover:border-accent hover:text-ink-primary"
          >
            → {a.shortName}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-ink-secondary">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/30">
            <ShieldCheck className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-ink-primary">Free 60-minute wait on arrivals</p>
            <p className="text-xs text-ink-muted">Live flight tracking included</p>
          </div>
        </div>
        <Button size="lg" onClick={startBooking}>
          Get my fare
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function TripTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all",
        active
          ? "border-accent bg-accent text-white shadow-glow"
          : "border-bg-border bg-bg-surface text-ink-secondary hover:text-ink-primary",
      )}
    >
      {children}
    </button>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  placeholder,
  list,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  list?: string;
  error?: string;
}) {
  return (
    <label className="group block">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </span>
      <div
        className={cn(
          "mt-1.5 flex items-center gap-2 rounded-2xl border bg-bg-surface px-3.5 py-3 transition-colors",
          error ? "border-accent" : "border-bg-border focus-within:border-accent",
        )}
      >
        <span className="text-accent">{icon}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          list={list}
          className="w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
          autoComplete="off"
        />
      </div>
      {error ? <span className="mt-1 block text-xs text-accent">{error}</span> : null}
    </label>
  );
}

function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
        Pickup time
      </span>
      <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-bg-border bg-bg-surface px-3.5 py-3 transition-colors focus-within:border-accent">
        <Calendar className="h-4 w-4 text-accent" />
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-ink-primary focus:outline-none [color-scheme:dark]"
        />
      </div>
    </label>
  );
}

function PassengerField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="block">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
        Passengers
      </span>
      <div className="mt-1.5 flex items-center justify-between gap-2 rounded-2xl border border-bg-border bg-bg-surface px-3.5 py-3">
        <div className="flex items-center gap-2 text-sm text-ink-primary">
          <Users className="h-4 w-4 text-accent" />
          <span>
            {value} {value === 1 ? "passenger" : "passengers"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Stepper aria="Decrease" onClick={() => onChange(Math.max(1, value - 1))}>
            <Minus className="h-3.5 w-3.5" />
          </Stepper>
          <Stepper aria="Increase" onClick={() => onChange(Math.min(8, value + 1))}>
            <Plus className="h-3.5 w-3.5" />
          </Stepper>
        </div>
      </div>
    </div>
  );
}

function Stepper({
  onClick,
  aria,
  children,
}: {
  onClick: () => void;
  aria: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={aria}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-bg-border bg-bg-elevated text-ink-secondary transition-colors hover:border-accent hover:text-ink-primary"
    >
      {children}
    </button>
  );
}
