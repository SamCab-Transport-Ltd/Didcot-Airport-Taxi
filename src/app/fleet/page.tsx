import type { Metadata } from "next";
import { Briefcase, Check, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CtaBanner } from "@/components/home/CtaBanner";
import { fleet } from "@/lib/fleet";

export const metadata: Metadata = {
  title: "Our Fleet",
  description:
    "Premium taxi fleet from Didcot — hybrid saloons, executive Mercedes, MPVs and 8-seaters. Every vehicle under three years old, valet-cleaned daily.",
  alternates: { canonical: "/fleet" },
};

export default function FleetPage() {
  return (
    <>
      <section className="bg-grid-fade py-16 sm:py-24">
        <Container size="wide">
          <SectionHeader
            eyebrow="The fleet"
            title="Every vehicle, every standard."
            description="Pick the class that fits your trip — from solo executive runs to family group travel."
          />
        </Container>
      </section>
      <section className="pb-20">
        <Container size="wide">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fleet.map((v) => (
              <article key={v.id} className="rounded-3xl border border-bg-border bg-bg-raised p-6">
                <h2 className="font-display text-2xl font-semibold">{v.name}</h2>
                <p className="text-sm text-ink-muted">{v.tagline}</p>
                <div className="mt-5 flex items-center gap-4 text-sm text-ink-secondary">
                  <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-accent" /> Up to {v.passengers}</span>
                  <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-accent" /> {v.luggage}</span>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-ink-secondary">
                  {v.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" /> {f}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
