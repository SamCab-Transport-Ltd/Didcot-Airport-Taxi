import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CtaBanner } from "@/components/home/CtaBanner";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${siteConfig.name} — a premium airport taxi service operated by ${siteConfig.legalName} in Didcot, Oxfordshire.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-grid-fade py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeader
            eyebrow="About"
            title="A local operator. A national standard."
            description={`${siteConfig.legalName} has been operating private hire vehicles from Didcot since day one. We built ${siteConfig.name} for the kind of journey we'd want for ourselves — pre-bookable, predictable, and premium.`}
          />
          <div className="prose-invert mt-10 space-y-5 text-ink-secondary">
            <p>
              Most taxi services are still operating like it's 1995 — phone
              calls, ambiguous prices, and an arrival window of "soon". We
              built {siteConfig.name} to be different: a fixed-price, fixed-time,
              executive-class transfer service that you can rely on at 4am as
              easily as 4pm.
            </p>
            <p>
              We are a licensed private hire operator under Vale of White Horse
              District Council. Every one of our drivers is DBS-checked, trained
              for executive standards and proud to wear the badge. Our fleet is
              less than three years old and valet-cleaned daily.
            </p>
            <p>
              Whether you're a Harwell scientist heading to a conference, a
              Milton Park executive on a client visit, or a family in Didcot
              flying out at dawn — we'll get you there. Calmly, comfortably,
              and on time.
            </p>
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
