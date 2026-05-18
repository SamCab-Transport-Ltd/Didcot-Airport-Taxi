import { Briefcase, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fleet } from "@/lib/fleet";

export function FleetSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container size="wide">
        <SectionHeader
          eyebrow="The fleet"
          title="From hybrid saloons to executive class."
          description="Every vehicle in our fleet is under three years old, valet-cleaned daily and equipped with Wi-Fi, chargers and bottled water as standard."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fleet.map((v) => (
            <div
              key={v.id}
              className="group relative overflow-hidden rounded-2xl border border-bg-border bg-bg-raised p-6 transition-all hover:border-accent/40"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 bg-red-fade opacity-0 transition-opacity group-hover:opacity-100" />
              <h3 className="font-display text-xl font-semibold">{v.name}</h3>
              <p className="text-sm text-ink-muted">{v.tagline}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-ink-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-accent" /> Up to {v.passengers}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-accent" /> {v.luggage}
                </span>
              </div>
              <ul className="mt-5 space-y-1.5 text-sm text-ink-secondary">
                {v.features.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
