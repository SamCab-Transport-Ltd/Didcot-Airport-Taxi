import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container size="narrow">
        <SectionHeader eyebrow="Legal" title="Terms of Service" />
        <div className="prose prose-invert mt-10 space-y-5 text-sm text-ink-secondary">
          <p>
            These terms govern your use of {siteConfig.name}, a service operated
            by {siteConfig.legalName}. By booking with us you agree to these
            terms.
          </p>
          <h2 className="font-display text-lg text-ink-primary">Bookings</h2>
          <p>
            All bookings are subject to driver availability. We will confirm
            your booking by email and SMS — please contact us if you do not
            receive confirmation within 30 minutes.
          </p>
          <h2 className="font-display text-lg text-ink-primary">Cancellations</h2>
          <p>
            Free cancellation up to 12 hours before your scheduled pickup.
            Within 12 hours, a small admin fee may apply. No charge applies
            where the cancellation is due to a confirmed flight cancellation
            outside your control.
          </p>
          <h2 className="font-display text-lg text-ink-primary">Liability</h2>
          <p>
            We carry hire-and-reward insurance with public liability up to £5m.
            Our liability for delays or missed connections is limited to the
            value of the booking except where negligence is proven.
          </p>
          <h2 className="font-display text-lg text-ink-primary">Disputes</h2>
          <p>
            These terms are governed by the laws of England and Wales. Please
            contact us first at {siteConfig.email} — most issues are resolved
            quickly.
          </p>
        </div>
      </Container>
    </section>
  );
}
