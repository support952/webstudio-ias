import { GlobalReachBanner } from "@/components/global-reach-banner";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQSection } from "@/components/faq-section";
import { PortfolioSection } from "@/components/portfolio-section";

/** Below-the-fold home sections — lazy-loaded from `home.tsx` to shrink the initial route chunk. */
export default function HomeLowerSections() {
  return (
    <>
      <PortfolioSection />
      <GlobalReachBanner />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}
