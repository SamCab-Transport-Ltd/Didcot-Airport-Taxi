import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Clock, MapPin, Plane } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { CtaBanner } from "@/components/home/CtaBanner";
import { FaqSection } from "@/components/home/Faq";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { airportList, airports } from "@/lib/airports";
import { generalFAQ } from "@/lib/faq";
import { formatGBP } from "@/lib/utils";
import { siteConfig, type AirportSlug } from "@/lib/site";

export async function generateStaticParams() {
  return airportList.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const a = airports[params.slug as AirportSlug];
  if (!a) return {};
  const title = `Didcot to ${a.shortName} Airport Taxi — Fixed Price from ${formatGBP(a.fareFrom)}`;
  return {
    title,
    description: `Pre-bookable, fixed-price taxi from Didcot to ${a.name} (${a.iata}). ${a.distanceMiles} miles, around ${a.driveTimeMins} minutes. Live flight tracking and 60-min free wait included.`,
    alternates: { canonical: `/airports/${a.slug}` },
    openGraph: {
      title,
      description: a.description,
      url: `${siteConfig.url}/airports/${a.slug}`,
    },
  };
}

export default function AirportPage({ params }: { params: { slug: string } }) {
  const a = airports[params.slug as AirportSlug];
  if (!a) notFound();

  const routeFaq = [
    {
      question: `How far is Didcot from ${a.shortName} Airport?`,
      answer: `Didcot is approximately ${a.distanceMiles} miles from ${a.name} (${a.iata}), with an average drive time of around ${a.driveTimeMins} minutes door-to-door.`,
    },
    {
      question: `How much is a taxi from Didcot to ${a.shortName} Airport?`,
      answer: `Fares start from ${formatGBP(a.fareFrom)} for a standard saloon, with executive and 8-seater vehicles available. Every price is fixed and includes flight tracking with up to 60 minutes of free wait on arrivals.`,
    },
    {
      question: `Can you collect me from ${a.shortName} Airport?`,
      answer: `Yes — we operate 24/7 and provide meet-and-greet collections from all terminals at ${a.name}. Just enter your inbound flight number when booking and we'll track it automatically.`,
    },
    ...generalFAQ.slice(0, 3),
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", href: "/" },
          { name: "Airports", href: "/airports" },
          { name: `Didcot to ${a.shortName}`, href: `/airports/${a.slug}` },
        ]}
      />
      <FaqJsonLd items={routeFaq} />

      <section className="bg-grid-fade py-16 sm:py-24">
        <Container size="wide">
          <nav className="mb-6 text-xs text-ink-muted">
            <Link href="/" className="hover:text-ink-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/airports" className="hover:text-ink-primary">Airports</Link>
            <span className="mx-2">/</span>
            <span className="text-ink-secondary">Didcot to {a.shortName}</span>
          </nav>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent">
                <Plane className="h-3.5 w-3.5" /> {a.iata} · {a.city}
              </span>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Didcot to {a.shortName} Airport Taxi
              </h1>
              <p className="mt-4 max-w-xl text-ink-secondary sm:text-lg">{a.description}</p>

              <dl className="mt-7 grid grid-cols-3 gap-4 sm:max-w-md">
                <Stat icon={<MapPin className="h-4 w-4" />} label="Distance" value={`${a.distanceMiles} mi`} />
                <Stat icon={<Clock className="h-4 w-4" />} label="Drive time" value={`~${a.driveTimeMins} min`} />
                <Stat icon={<Plane className="h-4 w-4" />} label="Fares from" value={formatGBP(a.fareFrom)} />
              </dl>

              <ul className="mt-7 grid gap-2.5 sm:max-w-lg sm:grid-cols-2">
                {a.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-ink-secondary">
                    <Check className="h-4 w-4 flex-none text-accent" /> {h}
                  </li>
                ))}
              </ul>
            </div>
            <BookingWidget />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                What's included on every Didcot → {a.shortName} transfer
              </h2>
              <ul className="mt-6 space-y-3 text-sm text-ink-secondary">
                <Bullet>Door-to-door, no shared rides</Bullet>
                <Bullet>Fixed-price guarantee — no surge, no surprises</Bullet>
                <Bullet>Live flight tracking with auto-adjusted pickup time</Bullet>
                <Bullet>60 minutes of free wait time on inbound arrivals</Bullet>
                <Bullet>Free child seats and booster seats on request</Bullet>
                <Bullet>Meet-and-greet at the arrivals hall available for £10</Bullet>
                <Bullet>24/7 dispatch with a real human on the phone</Bullet>
                <Bullet>Receipts and corporate invoicing on request</Bullet>
              </ul>
            </div>
            <div className="rounded-3xl border border-bg-border bg-bg-raised p-6 sm:p-8">
              <h3 className="font-display text-xl font-semibold">Why choose us for {a.shortName}?</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
                We've been running the Didcot → {a.shortName} route for years.
                Our drivers know every terminal, every shortcut and every
                short-stay drop-off. We monitor traffic 24/7 across the M40, M25
                and A34 so your pickup time is always recalculated when it
                matters — and we tell you about it before you have to ask.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <Card title="From" value="Didcot, OX11" />
                <Card title="To" value={`${a.name} (${a.iata})`} />
                <Card title="Distance" value={`${a.distanceMiles} miles`} />
                <Card title="Drive time" value={`~${a.driveTimeMins} mins`} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <FaqSection />
      <CtaBanner />
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-bg-border bg-bg-raised p-4">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-ink-muted">
        <span className="text-accent">{icon}</span>
        {label}
      </div>
      <div className="mt-2 font-display text-xl font-semibold text-ink-primary">{value}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Check className="mt-0.5 h-4 w-4 flex-none text-accent" />
      <span>{children}</span>
    </li>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-bg-border bg-bg-surface p-3">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">{title}</p>
      <p className="mt-1 text-sm text-ink-primary">{value}</p>
    </div>
  );
}
