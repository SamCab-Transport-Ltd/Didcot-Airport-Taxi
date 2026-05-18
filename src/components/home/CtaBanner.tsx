import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import { formatPhoneTel } from "@/lib/utils";

export function CtaBanner() {
  return (
    <section className="py-20">
      <Container size="wide">
        <div className="relative isolate overflow-hidden rounded-3xl border border-bg-border bg-bg-raised p-8 sm:p-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-accent/30 blur-3xl"
            aria-hidden
          />
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl lg:text-5xl">
                Ready when you are.{" "}
                <span className="text-accent">Book your ride in 60 seconds.</span>
              </h2>
              <p className="mt-4 max-w-xl text-ink-secondary">
                Get a fixed-price quote instantly, or speak to our 24/7 dispatch
                team — we'll have a car at your door whenever you need one.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button href="/book" size="lg" className="w-full">
                Book online
              </Button>
              <Button
                href={`tel:${formatPhoneTel(siteConfig.phone)}`}
                external
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Phone className="h-4 w-4" />
                {siteConfig.phoneDisplay}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
