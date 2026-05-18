import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { CtaBanner } from "@/components/home/CtaBanner";
import { FaqSection } from "@/components/home/Faq";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { areaList, areas } from "@/lib/areas";
import { airportList } from "@/lib/airports";
import { formatGBP } from "@/lib/utils";
import type { AreaSlug } from "@/lib/site";

export async function generateStaticParams() {
  return areaList.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const a = areas[params.slug as AreaSlug];
  if (!a) return {};
  const title = `${a.name} Airport Taxi — Premium Transfers from ${a.name}`;
  return {
    title,
    description: `Pre-bookable airport taxi service from ${a.name} (${a.postcodePrefixes.join(", ")}). Fixed prices, executive vehicles, 24/7 dispatch.`,
    alternates: { canonical: `/areas/${a.slug}` },
  };
}

export default function AreaPage({ params }: { params: { slug: string } }) {
  const a = areas[params.slug as AreaSlug];
  if (!a) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Areas", href: "/areas" },
          { name: a.name, href: `/areas/${a.slug}` },
        ]}
      />
      <section className="bg-grid-fade py-16 sm:py-24">
        <Container size="wide">
          <nav className="mb-6 text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/areas" className="hover:text-ink-primary">Areas</Link>
            <span className="mx-2">/</span>
            <span className="text-ink-secondary">{a.name}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent">
                <MapPin className="h-3.5 w-3.5" /> {a.postcodePrefixes.join(" · ")}
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
                {a.name} airport taxi service
              </h1>
              <p className="mt-4 max-w-xl text-ink-secondary sm:text-lg">{a.description}</p>
              <ul className="mt-7 grid gap-2.5 sm:max-w-md">
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" /> Pre-bookable, fixed-price transfers</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" /> Same-day bookings subject to availability</li>
                <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-accent" /> Account billing for local businesses</li>
              </ul>
            </div>
            <BookingWidget />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="wide">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Popular routes from {a.name}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {airportList.map((ap) => (
              <li key={ap.slug}>
                <Link
                  href={`/airports/${ap.slug}`}
                  className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-raised p-4 transition-all hover:border-accent/40"
                >
                  <span>
                    <span className="block text-sm text-ink-primary">{a.name} → {ap.shortName}</span>
                    <span className="block text-xs text-ink-muted">{ap.iata} · ~{ap.driveTimeMins} min</span>
                  </span>
                  <span className="font-display text-base font-semibold text-ink-primary">{formatGBP(ap.fareFrom)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FaqSection />
      <CtaBanner />
    </>
  );
}
