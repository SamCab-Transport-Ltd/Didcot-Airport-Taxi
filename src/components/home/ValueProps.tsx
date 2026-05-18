import { ShieldCheck, Plane, Banknote, Clock, Users, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const items = [
  {
    icon: ShieldCheck,
    title: "Fixed-price guarantee",
    body:
      "What you see is what you pay. No surge pricing, no surprises — even if traffic detours your route.",
  },
  {
    icon: Plane,
    title: "Live flight tracking",
    body:
      "We monitor every inbound flight automatically and adjust your pickup time to match. 60 minutes of free arrival wait included.",
  },
  {
    icon: Clock,
    title: "24/7 dispatch",
    body:
      "A real dispatcher answers the phone at 3am. Real-time ETAs sent by SMS the morning of your trip.",
  },
  {
    icon: Users,
    title: "DBS-checked drivers",
    body:
      "Every driver is licensed, background-checked and trained for executive service standards.",
  },
  {
    icon: Banknote,
    title: "Pay your way",
    body:
      "Card online, card in the car, Apple/Google Pay, or invoiced corporate accounts.",
  },
  {
    icon: Sparkles,
    title: "Premium fleet",
    body:
      "From hybrid saloons to executive Mercedes — every vehicle is under 3 years old, valet-cleaned daily.",
  },
];

export function ValueProps() {
  return (
    <section className="py-20 sm:py-24">
      <Container size="wide">
        <SectionHeader
          eyebrow="Why Didcot Airport Taxi"
          title="A premium service, built for travellers who can't be late."
          description="Every detail of our operation is designed to remove friction — from the moment you book to the moment you land."
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-bg-border bg-bg-raised p-6 transition-all hover:border-accent/40"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/0 blur-2xl transition-all group-hover:bg-accent/15" />
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-primary">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
