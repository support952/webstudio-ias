import { motion } from "framer-motion";
import { Code2, BrainCircuit, Palette, Megaphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { ServiceJsonLd } from "@/components/json-ld";
import { useI18n } from "@/lib/i18n";
import { TiltCard } from "@/components/tilt-card";

const services = [
  { icon: Code2, titleKey: "services.web.title", descKey: "services.web.desc", longKey: "services.web.long", gradient: "from-neon-purple to-blue-500", serviceParam: "Ecommerce" },
  { icon: BrainCircuit, titleKey: "services.ai.title", descKey: "services.ai.desc", longKey: "services.ai.long", gradient: "from-neon-cyan to-emerald-500", serviceParam: null },
  { icon: Palette, titleKey: "services.design.title", descKey: "services.design.desc", longKey: "services.design.long", gradient: "from-neon-pink to-rose-500", serviceParam: "Branding" },
  { icon: Megaphone, titleKey: "services.marketing.title", descKey: "services.marketing.desc", longKey: "services.marketing.long", gradient: "from-amber-400 to-orange-500", serviceParam: null, detailHref: "/marketing" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Services() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <SEOHead title="Services Catalog" path="/services" />
      <ServiceJsonLd />
      <div className="min-h-screen text-foreground font-sans antialiased relative bg-transparent">
        <Navbar />

        <main id="main-content">
          <section className="pt-safe-md pb-20 sm:pb-28 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-20 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[12px] px-6 py-12 sm:py-14 shadow-none"
              >
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-cyan-400/90">
                  {t("services.page.label")}
                </span>
                <h1
                  className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.02em] text-white mt-3 mb-3"
                  data-testid="text-services-title"
                >
                  {t("services.page.title").split(" ")[0]}{" "}
                  <span className="gradient-text">{t("services.page.title").split(" ").slice(1).join(" ")}</span>
                </h1>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto mb-5" />
                <p className="text-slate-400 max-w-xl mx-auto text-base leading-[1.65]">
                  {t("services.page.subtitle")}
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {services.map((service, idx) => (
                  <motion.div
                    key={service.titleKey}
                    variants={itemVariants}
                  >
                  <TiltCard maxTilt={6}>
                  <div
                    className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-[12px] p-6 sm:p-8 md:p-10 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-black/15"
                    data-testid={`card-service-detail-${idx}`}
                  >
                    <div
                      className={`flex flex-col md:flex-row gap-6 md:gap-10 items-start ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                    >
                      <div className="shrink-0 flex items-start">
                        <div
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg`}
                        >
                          <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-3">
                          {t(service.titleKey)}
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base leading-[1.65] mb-6">
                          {t(service.longKey)}
                        </p>
                        <Link href={"detailHref" in service && service.detailHref ? service.detailHref : service.serviceParam ? `/contact?service=${service.serviceParam}` : "/contact"}>
                          <Button
                            size="sm"
                            className="rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate px-6 py-5 text-sm font-medium tracking-wide shadow-lg hover:shadow-xl transition-shadow duration-300"
                            data-testid={`button-service-cta-${idx}`}
                          >
                            {"detailHref" in service && service.detailHref ? t("products.cta") : t("nav.getStarted")}
                            <ArrowRight className="w-4 h-4 ms-2 opacity-90 rtl:rotate-180" aria-hidden />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  </TiltCard>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
