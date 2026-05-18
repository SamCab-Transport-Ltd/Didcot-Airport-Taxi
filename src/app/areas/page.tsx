import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { areaList } from "@/lib/areas";

export const metadata: Metadata = {
  title: "Areas We Serve",
  description:
    "Premium airport taxi service from Didcot, Abingdon, Wantage, Wallingford, Harwell, Milton Park, Culham and Oxford.",
  alternates: { canonical: "/areas" },
};

export default function AreasIndex() {
  return (
    <section className="py-16 sm:py-24">
      <Container size="wide">
        <SectionHeader
          eyebrow="Areas served"
          title="Premium transfers across South Oxfordshire."
          description="We cover Didcot and the surrounding towns and villages — from Abingdon and Wantage to Wallingford, Harwell and Oxford."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areaList.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/areas/${a.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-bg-border bg-bg-raised p-6 transition-all hover:border-accent/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-accent">
                      <MapPin className="h-3.5 w-3.5" /> {a.postcodePrefixes.join(", ")}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-ink-muted group-hover:text-accent" />
                  </div>
                  <h2 className="mt-3 font-display text-xl font-semibold">{a.name} taxi service</h2>
                  <p className="mt-2 text-sm text-ink-secondary">{a.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
