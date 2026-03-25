import { lazy, Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesStrip } from "@/components/features-strip";
import { ProcessSection } from "@/components/process-section";
import { Footer } from "@/components/footer";

const HomeLowerSections = lazy(() => import("./home-lower-sections"));
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { OrganizationJsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
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
          <ProcessSection />

          <section className="section-spacing relative bg-transparent">
            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[12px] px-6 py-14 sm:py-16">
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
                    <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <Suspense fallback={null}>
            <HomeLowerSections />
          </Suspense>
          </main>
          <Footer />
        </div>
      </div>
    </PageWrapper>
  );
}
