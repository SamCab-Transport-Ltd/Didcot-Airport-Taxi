"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plane,
  Users,
  Briefcase,
  CalendarClock,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fleet, type Vehicle } from "@/lib/fleet";
import { estimateFare } from "@/lib/fare";
import { formatGBP, cn } from "@/lib/utils";
import { track } from "@/lib/tracking";

const schema = z.object({
  tripType: z.enum(["one-way", "return", "hourly"]),
  from: z.string().min(2, "Please enter a pickup location"),
  to: z.string().min(2, "Please enter a destination"),
  pickupAt: z.string().min(1, "Please pick a date and time"),
  returnAt: z.string().optional(),
  passengers: z.number().min(1).max(8),
  luggage: z.number().min(0).max(12),
  vehicleId: z.enum(["saloon", "estate", "mpv", "executive", "8-seater"]),
  flightNumber: z.string().optional(),
  notes: z.string().optional(),
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  meetGreet: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const steps = ["Trip", "Vehicle", "Details", "Confirm"] as const;

export function BookingFlow() {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initial = useMemo<Partial<FormValues>>(
    () => ({
      tripType: (params.get("type") as FormValues["tripType"]) || "one-way",
      from: params.get("from") || "Didcot Parkway Station",
      to: params.get("to") || "",
      pickupAt: params.get("pickup") || "",
      passengers: Number(params.get("passengers")) || 2,
      luggage: 2,
      vehicleId: "saloon",
    }),
    [params],
  );

  const { register, handleSubmit, control, watch, setValue, formState, trigger } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: initial,
      mode: "onChange",
    });

  const values = watch();
  const fare = useMemo(() => {
    if (!values.from || !values.to) return null;
    return estimateFare({
      from: values.from,
      to: values.to,
      vehicleId: values.vehicleId || "saloon",
      passengers: values.passengers || 1,
      pickupAt: values.pickupAt,
      returnTrip: values.tripType === "return",
    });
  }, [values.from, values.to, values.vehicleId, values.passengers, values.pickupAt, values.tripType]);

  useEffect(() => {
    if (fare) {
      track({
        event: "fare_estimated",
        params: { total: fare.total, miles: fare.estimatedMiles, vehicle: values.vehicleId },
      });
    }
  }, [fare?.total, values.vehicleId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function next() {
    const fieldsByStep: Array<Array<keyof FormValues>> = [
      ["tripType", "from", "to", "pickupAt", "passengers"],
      ["vehicleId"],
      ["name", "email", "phone"],
      [],
    ];
    const ok = await trigger(fieldsByStep[step] as Array<keyof FormValues>);
    if (!ok) return;
    track({ event: "booking_step_completed", params: { step: steps[step] } });
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  async function onSubmit(data: FormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, fare }),
      });
      if (!res.ok) throw new Error("Submission failed");
      track({
        event: "booking_submitted",
        params: { total: fare?.total, vehicle: data.vehicleId, tripType: data.tripType },
      });
      setSubmitted(true);
    } catch (e) {
      setError(
        "We couldn't submit your booking. Please call us directly and we'll take it over the phone.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-bg-border bg-bg-raised p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 ring-1 ring-accent/40">
          <Check className="h-7 w-7 text-accent" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-semibold sm:text-3xl">
          Booking request received
        </h2>
        <p className="mt-3 text-ink-secondary">
          A confirmation will land in your inbox within minutes. Our dispatch
          team will call you 24 hours before pickup to re-confirm.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="secondary">Back to home</Button>
          <Button href="/airports">Browse airports</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-bg-border bg-bg-raised p-5 sm:p-8">
        <Stepper current={step} />

        {step === 0 ? (
          <div className="mt-7 space-y-5">
            <Row label="Trip type">
              <Controller
                control={control}
                name="tripType"
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2">
                    {(["one-way", "return", "hourly"] as const).map((t) => (
                      <PillButton
                        key={t}
                        active={field.value === t}
                        onClick={() => field.onChange(t)}
                      >
                        {t === "one-way" ? "One-way" : t === "return" ? "Return" : "By the hour"}
                      </PillButton>
                    ))}
                  </div>
                )}
              />
            </Row>
            <Row label="Pickup location" error={formState.errors.from?.message}>
              <input
                {...register("from")}
                placeholder="Address, postcode or landmark"
                className="input"
              />
            </Row>
            <Row label="Destination" error={formState.errors.to?.message}>
              <input
                {...register("to")}
                placeholder="Airport, address or postcode"
                className="input"
              />
            </Row>
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Pickup date & time" error={formState.errors.pickupAt?.message}>
                <input type="datetime-local" {...register("pickupAt")} className="input [color-scheme:dark]" />
              </Row>
              {values.tripType === "return" ? (
                <Row label="Return date & time">
                  <input type="datetime-local" {...register("returnAt")} className="input [color-scheme:dark]" />
                </Row>
              ) : (
                <Row label="Passengers">
                  <Controller
                    control={control}
                    name="passengers"
                    render={({ field }) => (
                      <NumberStepper value={field.value} onChange={field.onChange} min={1} max={8} />
                    )}
                  />
                </Row>
              )}
            </div>
            {values.tripType === "return" ? (
              <Row label="Passengers">
                <Controller
                  control={control}
                  name="passengers"
                  render={({ field }) => (
                    <NumberStepper value={field.value} onChange={field.onChange} min={1} max={8} />
                  )}
                />
              </Row>
            ) : null}
            <Row label="Luggage">
              <Controller
                control={control}
                name="luggage"
                render={({ field }) => (
                  <NumberStepper value={field.value} onChange={field.onChange} min={0} max={12} />
                )}
              />
            </Row>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="mt-7 grid gap-3">
            {fleet.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                price={fare ? Math.round(fare.base * v.multiplier + fare.surcharge) : null}
                returnTrip={values.tripType === "return"}
                selected={values.vehicleId === v.id}
                onSelect={() => setValue("vehicleId", v.id, { shouldValidate: true })}
              />
            ))}
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-7 grid gap-4">
            <Row label="Full name" error={formState.errors.name?.message}>
              <div className="input-wrap"><User className="icon" />
                <input {...register("name")} placeholder="Jane Smith" className="input-inner" />
              </div>
            </Row>
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Email" error={formState.errors.email?.message}>
                <div className="input-wrap"><Mail className="icon" />
                  <input {...register("email")} placeholder="jane@example.com" className="input-inner" />
                </div>
              </Row>
              <Row label="Mobile number" error={formState.errors.phone?.message}>
                <div className="input-wrap"><Phone className="icon" />
                  <input {...register("phone")} placeholder="07700 900000" className="input-inner" />
                </div>
              </Row>
            </div>
            <Row label="Flight number (optional)">
              <div className="input-wrap"><Plane className="icon" />
                <input {...register("flightNumber")} placeholder="e.g. BA288" className="input-inner" />
              </div>
            </Row>
            <Row label="Notes for the driver (optional)">
              <textarea {...register("notes")} rows={3} placeholder="Anything we should know — child seats, extra luggage, stops along the way." className="input min-h-[100px] py-3" />
            </Row>
            <label className="flex items-center gap-3 rounded-2xl border border-bg-border bg-bg-surface px-4 py-3 text-sm">
              <input type="checkbox" {...register("meetGreet")} className="h-4 w-4 accent-[#FF0000]" />
              <span>
                Add meet-and-greet at arrivals
                <span className="ml-2 text-ink-muted">(+£10, driver waits in terminal with a name board)</span>
              </span>
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-7 space-y-4">
            <Summary values={values} fare={fare} />
            {error ? (
              <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
                {error}
              </p>
            ) : null}
            <p className="text-xs text-ink-muted">
              By submitting, you agree to our terms of service and privacy policy.
              Your card is not charged here — we contact you to confirm payment options.
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={next} type="button">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Confirm booking"} <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      <aside className="space-y-4">
        <FareCard fare={fare} tripType={values.tripType} vehicleId={values.vehicleId} />
        <TrustCard />
      </aside>

      <style jsx global>{`
        .input {
          width: 100%;
          background: #141417;
          border: 1px solid #26262c;
          border-radius: 16px;
          padding: 12px 14px;
          color: #f5f5f6;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }
        .input:focus { outline: none; border-color: #ff0000; }
        .input::placeholder { color: #7a7a82; }
        .input-wrap {
          display: flex; align-items: center; gap: 8px;
          background: #141417;
          border: 1px solid #26262c;
          border-radius: 16px;
          padding: 12px 14px;
          transition: border-color 0.2s ease;
        }
        .input-wrap:focus-within { border-color: #ff0000; }
        .input-inner {
          background: transparent; border: none; color: #f5f5f6;
          width: 100%; font-size: 14px;
        }
        .input-inner:focus { outline: none; }
        .input-inner::placeholder { color: #7a7a82; }
        .icon { width: 16px; height: 16px; color: #ff0000; flex: none; }
      `}</style>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 text-xs">
      {steps.map((s, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex h-6 min-w-6 items-center justify-center rounded-full border px-2",
                state === "active" && "border-accent bg-accent text-white",
                state === "done" && "border-accent/40 bg-accent/15 text-accent",
                state === "todo" && "border-bg-border bg-bg-surface text-ink-muted",
              )}
            >
              {state === "done" ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            <span
              className={cn(
                "uppercase tracking-[0.16em]",
                state === "active" ? "text-ink-primary" : "text-ink-muted",
              )}
            >
              {s}
            </span>
            {i < steps.length - 1 ? <span className="mx-1 h-px w-6 bg-bg-border" /> : null}
          </li>
        );
      })}
    </ol>
  );
}

function Row({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-accent">{error}</span> : null}
    </label>
  );
}

function PillButton({
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
        "rounded-full border px-4 py-2 text-sm transition-all",
        active
          ? "border-accent bg-accent text-white shadow-glow"
          : "border-bg-border bg-bg-surface text-ink-secondary hover:text-ink-primary",
      )}
    >
      {children}
    </button>
  );
}

function NumberStepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-bg-border bg-bg-surface px-4 py-3">
      <div className="flex items-center gap-2 text-sm">
        <Users className="h-4 w-4 text-accent" />
        <span>{value}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="h-7 w-7 rounded-full border border-bg-border bg-bg-elevated text-ink-secondary hover:border-accent hover:text-ink-primary"
        >
          –
        </button>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="h-7 w-7 rounded-full border border-bg-border bg-bg-elevated text-ink-secondary hover:border-accent hover:text-ink-primary"
        >
          +
        </button>
      </div>
    </div>
  );
}

function VehicleCard({
  vehicle,
  selected,
  onSelect,
  price,
  returnTrip,
}: {
  vehicle: Vehicle;
  selected: boolean;
  onSelect: () => void;
  price: number | null;
  returnTrip: boolean;
}) {
  const displayPrice = price ? (returnTrip ? Math.round(price * 1.85) : price) : null;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border bg-bg-surface p-4 text-left transition-all sm:p-5",
        selected
          ? "border-accent shadow-glow"
          : "border-bg-border hover:border-bg-border/80 hover:bg-bg-elevated",
      )}
    >
      <div
        className={cn(
          "flex h-14 w-14 flex-none items-center justify-center rounded-xl",
          selected ? "bg-accent/15 ring-1 ring-accent/40" : "bg-bg-elevated",
        )}
      >
        <Sparkles className={cn("h-6 w-6", selected ? "text-accent" : "text-ink-secondary")} />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-base font-semibold sm:text-lg">{vehicle.name}</h3>
          {displayPrice ? (
            <span className="font-display text-base font-semibold text-ink-primary sm:text-lg">
              {formatGBP(displayPrice)}
            </span>
          ) : null}
        </div>
        <p className="text-xs text-ink-muted sm:text-sm">{vehicle.tagline}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-secondary">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-accent" />
            Up to {vehicle.passengers}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-accent" />
            {vehicle.luggage}
          </span>
          {vehicle.features.slice(0, 1).map((f) => (
            <span key={f} className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              {f}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function Summary({ values, fare }: { values: FormValues; fare: ReturnType<typeof estimateFare> | null }) {
  const vehicle = fleet.find((v) => v.id === values.vehicleId);
  return (
    <div className="space-y-3 rounded-2xl border border-bg-border bg-bg-surface p-5">
      <Line label="Trip type" value={values.tripType === "one-way" ? "One-way" : values.tripType === "return" ? "Return" : "Hourly"} />
      <Line label="From" value={values.from} />
      <Line label="To" value={values.to} />
      <Line label="Pickup" value={values.pickupAt} />
      {values.tripType === "return" && values.returnAt ? <Line label="Return" value={values.returnAt} /> : null}
      <Line label="Passengers" value={`${values.passengers}`} />
      <Line label="Vehicle" value={vehicle?.name || "—"} />
      {values.flightNumber ? <Line label="Flight" value={values.flightNumber} /> : null}
      {values.meetGreet ? <Line label="Meet & Greet" value="Yes (+£10)" /> : null}
      <div className="my-2 h-px bg-bg-border" />
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-secondary">Estimated total</span>
        <span className="font-display text-2xl font-semibold text-ink-primary">
          {fare ? formatGBP(fare.total + (values.meetGreet ? 10 : 0)) : "—"}
        </span>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right text-ink-primary">{value}</span>
    </div>
  );
}

function FareCard({
  fare,
  tripType,
  vehicleId,
}: {
  fare: ReturnType<typeof estimateFare> | null;
  tripType: FormValues["tripType"];
  vehicleId: FormValues["vehicleId"];
}) {
  const vehicle = fleet.find((v) => v.id === vehicleId);
  return (
    <div className="rounded-2xl border border-bg-border bg-bg-raised p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
          Live estimate
        </span>
        <CalendarClock className="h-4 w-4 text-accent" />
      </div>
      <div className="mt-3">
        {fare ? (
          <>
            <div className="font-display text-4xl font-semibold tracking-tight">
              {formatGBP(fare.total)}
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              {vehicle?.name} · {fare.estimatedMiles} mi · ~{fare.estimatedMins} min
              {tripType === "return" ? " · return included" : ""}
            </p>
          </>
        ) : (
          <p className="text-sm text-ink-muted">Enter your route to see a live fare.</p>
        )}
      </div>
      <ul className="mt-5 space-y-2 text-xs text-ink-secondary">
        <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> Fixed-price guarantee</li>
        <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> 60 min free wait on arrivals</li>
        <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent" /> Free cancellation up to 12 hrs</li>
      </ul>
    </div>
  );
}

function TrustCard() {
  return (
    <div className="rounded-2xl border border-bg-border bg-bg-raised p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 ring-1 ring-accent/40">
          <ShieldCheck className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="text-sm text-ink-primary">Licensed private hire</p>
          <p className="text-xs text-ink-muted">DBS-checked drivers · fully insured</p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-secondary">
        SamCab Transport Ltd. is a licensed operator with Vale of White Horse
        District Council. Every journey is covered by hire-and-reward insurance
        with public liability up to £5m.
      </p>
    </div>
  );
}
