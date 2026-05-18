import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const reviews = [
  {
    name: "Olivia M.",
    location: "Harwell",
    rating: 5,
    body:
      "Booked a Heathrow run at 4am for a family of five. The driver was waiting 10 minutes early in a spotless Caravelle, helped with every suitcase, and we made the gate with time to spare. Worth every penny.",
  },
  {
    name: "Daniel R.",
    location: "Milton Park",
    rating: 5,
    body:
      "Use them weekly for client trips into London City. Always professional, always on time, and the invoicing for our company account is faultless. Easy choice.",
  },
  {
    name: "Priya S.",
    location: "Didcot",
    rating: 5,
    body:
      "My flight was delayed three hours coming back from Stansted. They tracked it, the driver was there when I cleared the gate. Saved a stressful end to a long trip.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24">
      <Container size="wide">
        <SectionHeader
          eyebrow="What customers say"
          title="Rated 4.9 by travellers across Oxfordshire."
        />
        <ul className="mt-12 grid gap-4 lg:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.name}
              className="rounded-2xl border border-bg-border bg-bg-raised p-6"
            >
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
                "{r.body}"
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ink-muted">
                {r.name} · {r.location}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
