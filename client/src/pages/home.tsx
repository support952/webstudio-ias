import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesStrip } from "@/components/features-strip";
import { TrustSection } from "@/components/trust-section";
import { GlobalReachBanner } from "@/components/global-reach-banner";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { OrganizationJsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();
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

          <section className="section-spacing relative bg-transparent">
            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[12px] px-6 py-14 sm:py-16"
              >
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
                  {t("home.exploreProducts")}
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent mx-auto mb-5" />
                <p className="text-muted-foreground max-w-xl mx-auto text-base leading-[1.65] mb-8">
                  {t("home.exploreProductsDesc")}
                </p>
                <Link href="/products">
                  <Button
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-primary-foreground border-0 px-8 py-6 text-sm font-semibold tracking-wide shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {t("home.exploreProductsCta")}
                    <ArrowRight className="w-4 h-4 ms-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>

          <TrustSection />
          <GlobalReachBanner />
          <TestimonialsSection />
          <FAQSection />
          </main>
          <Footer />
        </div>
      </div>
    </PageWrapper>
  );
}
