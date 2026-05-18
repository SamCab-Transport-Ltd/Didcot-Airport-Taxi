import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import { formatPhoneTel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${siteConfig.name}. Call our 24/7 dispatch team or email bookings@didcotairporttaxi.co.uk.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24">
      <Container size="narrow">
        <SectionHeader
          eyebrow="Get in touch"
          title="We're available 24 hours a day."
          description="The quickest way to reach us is by phone — a real dispatcher answers every call, day or night."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href={`tel:${formatPhoneTel(siteConfig.phone)}`}
            className="group flex items-center gap-4 rounded-2xl border border-bg-border bg-bg-raised p-5 transition-all hover:border-accent/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
              <Phone className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.18em] text-ink-muted">Call us</span>
              <span className="block font-display text-lg font-semibold">{siteConfig.phoneDisplay}</span>
            </span>
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="group flex items-center gap-4 rounded-2xl border border-bg-border bg-bg-raised p-5 transition-all hover:border-accent/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
              <Mail className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.18em] text-ink-muted">Email</span>
              <span className="block font-display text-lg font-semibold">{siteConfig.email}</span>
            </span>
          </a>
          <div className="flex items-center gap-4 rounded-2xl border border-bg-border bg-bg-raised p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
              <MapPin className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.18em] text-ink-muted">Base</span>
              <span className="block font-display text-lg font-semibold">Didcot, Oxfordshire</span>
            </span>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-bg-border bg-bg-raised p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
              <Clock className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-[0.18em] text-ink-muted">Hours</span>
              <span className="block font-display text-lg font-semibold">24/7 · 365 days</span>
            </span>
          </div>
        </div>
        <div className="mt-10 rounded-3xl border border-bg-border bg-bg-raised p-8 text-center">
          <h2 className="font-display text-2xl font-semibold">Need a quick quote?</h2>
          <p className="mt-2 text-sm text-ink-secondary">Skip the form — book online and get a price instantly.</p>
          <div className="mt-5">
            <Button href="/book" size="lg">Book online</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
