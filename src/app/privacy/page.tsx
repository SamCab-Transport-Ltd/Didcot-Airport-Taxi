import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container size="narrow">
        <SectionHeader eyebrow="Legal" title="Privacy Policy" />
        <div className="prose prose-invert mt-10 space-y-5 text-sm text-ink-secondary">
          <p>
            {siteConfig.legalName} ("we", "our", "us") operates {siteConfig.name}.
            This page describes the personal information we collect and how we
            handle it.
          </p>
          <h2 className="font-display text-lg text-ink-primary">Information we collect</h2>
          <p>
            When you make a booking we collect: your name, contact details
            (email and phone), pickup and drop-off locations, travel times,
            flight numbers, and any special requests. We may also collect
            anonymised analytics about how you use the site to improve it.
          </p>
          <h2 className="font-display text-lg text-ink-primary">How we use it</h2>
          <p>
            Strictly to deliver and improve our service: dispatch your booking,
            keep you informed about your trip, provide receipts, and improve our
            website and marketing. We never sell personal data.
          </p>
          <h2 className="font-display text-lg text-ink-primary">Tracking</h2>
          <p>
            We use Google Analytics 4 and Meta Pixel (with server-side
            forwarding) to measure marketing performance. PII is hashed before
            being sent to advertising platforms.
          </p>
          <h2 className="font-display text-lg text-ink-primary">Your rights</h2>
          <p>
            Under UK GDPR you may request a copy of, or deletion of, your
            personal data at any time. Contact {siteConfig.email}.
          </p>
        </div>
      </Container>
    </section>
  );
}
