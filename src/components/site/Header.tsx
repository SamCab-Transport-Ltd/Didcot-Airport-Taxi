"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import { formatPhoneTel } from "@/lib/utils";
import { track } from "@/lib/tracking";
import { cn } from "@/lib/utils";

const nav = [
  { name: "Airports", href: "/airports" },
  { name: "Long Distance", href: "/long-distance" },
  { name: "Fleet", href: "/fleet" },
  { name: "Areas", href: "/areas" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-bg-border bg-bg-base/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm text-ink-secondary transition-colors hover:bg-bg-surface hover:text-ink-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${formatPhoneTel(siteConfig.phone)}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-primary hover:text-accent"
            onClick={() => track({ event: "phone_click", params: { location: "header" } })}
          >
            <Phone className="h-4 w-4 text-accent" />
            {siteConfig.phoneDisplay}
          </a>
          <Button href="/book" size="sm">
            Book Now
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-bg-border bg-bg-surface text-ink-primary lg:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-bg-border bg-bg-base lg:hidden">
          <div className="space-y-1 px-5 py-4 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-secondary hover:bg-bg-surface hover:text-ink-primary"
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-bg-border pt-4">
              <a
                href={`tel:${formatPhoneTel(siteConfig.phone)}`}
                className="inline-flex items-center gap-2 rounded-lg bg-bg-surface px-3 py-3 text-sm font-medium text-ink-primary"
                onClick={() => track({ event: "phone_click", params: { location: "mobile-menu" } })}
              >
                <Phone className="h-4 w-4 text-accent" />
                Call {siteConfig.phoneDisplay}
              </a>
              <Button href="/book" size="md" className="w-full">
                Book Online
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
