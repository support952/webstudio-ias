import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesStrip } from "@/components/features-strip";
import { ExamplesShowcase } from "@/components/examples-showcase";
import { TrustSection } from "@/components/trust-section";
import { GlobalReachBanner } from "@/components/global-reach-banner";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ServicesOverview } from "@/components/services-overview";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { OrganizationJsonLd } from "@/components/json-ld";

export default function Home() {
  return (
    <PageWrapper>
      <SEOHead title="Home" path="/" />
      <OrganizationJsonLd />
      <div className="min-h-screen text-foreground font-sans antialiased relative bg-transparent" data-unified-canvas>
        <div className="relative z-10 bg-transparent">
          <Navbar />
          <main id="main-content" className="bg-transparent">
          <HeroSection />
          <FeaturesStrip />
          <ExamplesShowcase />
          <TrustSection />
          <GlobalReachBanner />
          <TestimonialsSection />
          <ServicesOverview />
          <FAQSection />
          </main>
          <Footer />
        </div>
      </div>
    </PageWrapper>
  );
}
