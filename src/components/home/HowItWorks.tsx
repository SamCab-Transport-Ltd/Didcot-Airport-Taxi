import { CalendarCheck, Car, Plane, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    icon: CalendarCheck,
    title: "Book in 60 seconds",
    body: "Pick your route, your time and your vehicle. Get a fixed-price quote instantly — no account required.",
  },
  {
    icon: Sparkles,
    title: "We confirm everything",
    body: "Email + SMS confirmation in minutes. We pre-call you the day before with your driver's name and details.",
  },
  {
    icon: Car,
    title: "Driver tracked to the door",
    body: "Live ETA the morning of the trip. Driver waits, doors opened, luggage handled. You sit back.",
  },
  {
    icon: Plane,
    title: "Stress-free arrivals",
    body: "We track your inbound flight, adjust the pickup time and meet you in arrivals with a name board.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-bg-border bg-bg-raised py-20 sm:py-24">
      <Container size="wide">
        <SectionHeader
          eyebrow="How it works"
          title="Four steps. Zero stress."
          align="center"
        />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-bg-border bg-bg-surface p-6"
            >
              <span className="font-display text-5xl font-semibold text-bg-elevated">
                0{i + 1}
              </span>
              <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/30">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{s.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
