import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { CtaBanner } from "@/components/home/CtaBanner";
import { generalFAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about booking, fares, flight tracking and cancellations.",
  alternates: { canonical: "/faq" },
};

export default function FAQPage() {
  return (
    <>
      <FaqJsonLd items={generalFAQ} />
      <section className="py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeader
            eyebrow="FAQ"
            title="Answers, ahead of the question."
            description="Common questions about our service. Don't see what you need? Call us anytime."
          />
          <div className="mt-10 space-y-3">
            {generalFAQ.map((q) => (
              <details
                key={q.question}
                className="group rounded-2xl border border-bg-border bg-bg-raised p-5 open:border-accent/30"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-medium">
                  {q.question}
                  <span className="text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{q.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
