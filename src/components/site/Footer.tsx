import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/site";
import { airportList } from "@/lib/airports";
import { areaList } from "@/lib/areas";
import { formatPhoneTel } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-bg-border bg-bg-raised">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-secondary">
              Premium, pre-bookable airport and long-distance taxi service from
              Didcot, Oxfordshire — operated by {siteConfig.legalName}.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink-secondary">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-none text-accent" />
                <a
                  href={`tel:${formatPhoneTel(siteConfig.phone)}`}
                  className="hover:text-ink-primary"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-none text-accent" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-ink-primary"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-none text-accent" />
                <span>Didcot, Oxfordshire, OX11</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-none text-accent" />
                <span>24/7 dispatch · 365 days a year</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Airports
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-secondary">
              {airportList.map((a) => (
                <li key={a.slug}>
                  <Link href={`/airports/${a.slug}`} className="hover:text-ink-primary">
                    Didcot to {a.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Areas
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-secondary">
              {areaList.map((a) => (
                <li key={a.slug}>
                  <Link href={`/areas/${a.slug}`} className="hover:text-ink-primary">
                    {a.name} taxi
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-secondary">
              <li><Link href="/about" className="hover:text-ink-primary">About</Link></li>
              <li><Link href="/fleet" className="hover:text-ink-primary">Fleet</Link></li>
              <li><Link href="/long-distance" className="hover:text-ink-primary">Long Distance</Link></li>
              <li><Link href="/faq" className="hover:text-ink-primary">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-ink-primary">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-ink-primary">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-ink-primary">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-bg-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. Trading as{" "}
            {siteConfig.name}. All rights reserved.
          </p>
          <p>Licensed private hire operator · Vale of White Horse District Council.</p>
        </div>
      </div>
    </footer>
  );
}
