import { Hero } from "@/components/home/Hero";
import { ValueProps } from "@/components/home/ValueProps";
import { PopularRoutes } from "@/components/home/PopularRoutes";
import { FleetSection } from "@/components/home/FleetSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { FaqSection } from "@/components/home/Faq";
import { CtaBanner } from "@/components/home/CtaBanner";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { generalFAQ } from "@/lib/faq";

export default function HomePage() {
  return (
    <>
      <FaqJsonLd items={generalFAQ} />
      <Hero />
      <ValueProps />
      <PopularRoutes />
      <HowItWorks />
      <FleetSection />
      <Testimonials />
      <FaqSection limit={6} />
      <CtaBanner />
    </>
  );
}
