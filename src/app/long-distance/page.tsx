import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { CtaBanner } from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "Long-Distance & Corporate Taxi from Didcot",
  description:
    "Long-distance and corporate travel from Didcot to anywhere in the UK. Executive vehicles, Wi-Fi, refreshments and invoiced billing.",
  alternates: { canonical: "/long-distance" },
};

const useCases = [
  {
    title: "Cross-country meetings",
    body:
      "Door-to-door corporate transfers from Didcot to London, Manchester, Bristol, Birmingham and beyond — with on-board Wi-Fi so you can work in transit.",
  },
  {
    title: "Cruise terminal transfers",
    body:
      "Southampton, Portsmouth, Dover and Liverpool cruise terminals. Estate cars and 8-seaters available for groups with luggage.",
  },
  {
    title: "Event & wedding travel",
    body:
      "Reliable, executive-class travel for weddings, concerts, race meets and corporate events anywhere in the UK.",
  },
  {
    title: "Group transport",
    body:
      "Up to 8 passengers in a single Mercedes Vito or VW Caravelle — perfect for families, sports teams or small business groups.",
  },
];

export default function LongDistancePage() {
  return (
    <>
      <section className="bg-grid-fade py-16 sm:py-24">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div>
              <SectionHeader
                eyebrow="Long distance"
                title="Premium long-distance travel from Didcot."
                description="Same fixed-price commitment. Same executive vehicles. Across the country."
              />
              <ul className="mt-7 grid gap-2.5 sm:max-w-lg sm:grid-cols-2">
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" /> Executive E-Class & 5 Series</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" /> On-board Wi-Fi & chargers</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" /> Refreshments included</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" /> Driver-change for 6+ hour trips</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" /> Account billing & invoicing</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" /> Same fixed-price guarantee</li>
              </ul>
            </div>
            <BookingWidget />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="wide">
          <div className="grid gap-5 sm:grid-cols-2">
            {useCases.map((c) => (
              <article key={c.title} className="rounded-2xl border border-bg-border bg-bg-raised p-6">
                <h2 className="font-display text-xl font-semibold">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{c.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
