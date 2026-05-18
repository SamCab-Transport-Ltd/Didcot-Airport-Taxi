import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { generalFAQ } from "@/lib/faq";

export function FaqSection({ limit }: { limit?: number }) {
  const items = limit ? generalFAQ.slice(0, limit) : generalFAQ;
  return (
    <section className="border-t border-bg-border bg-bg-raised py-20 sm:py-24">
      <Container size="wide">
        <SectionHeader eyebrow="Frequently asked" title="Everything you need to know." />
        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {items.map((q) => (
            <details
              key={q.question}
              className="group rounded-2xl border border-bg-border bg-bg-surface p-5 transition-all open:border-accent/30"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-medium text-ink-primary">
                {q.question}
                <span className="text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{q.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
