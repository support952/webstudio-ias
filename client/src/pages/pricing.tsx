import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";
import { useRef, useState, useEffect } from "react";

const plans = [
  {
    nameKey: "pricing.starter",
    descKey: "pricing.starter.desc",
    priceKey: "pricing.starter.price",
    features: ["pricing.feature.1a", "pricing.feature.1b", "pricing.feature.1c", "pricing.feature.1d", "pricing.feature.1e", "pricing.feature.security", "pricing.feature.server", "pricing.feature.retainer"],
    popular: false,
    id: "starter",
  },
  {
    nameKey: "pricing.pro",
    descKey: "pricing.pro.desc",
    priceKey: "pricing.pro.price",
    features: ["pricing.feature.2a", "pricing.feature.2b", "pricing.feature.2c", "pricing.feature.2d", "pricing.feature.2e", "pricing.feature.2f", "pricing.feature.2g", "pricing.feature.security", "pricing.feature.server", "pricing.feature.retainer"],
    popular: true,
    id: "pro",
  },
  {
    nameKey: "pricing.enterprise",
    descKey: "pricing.enterprise.desc",
    priceKey: "pricing.enterprise.price",
    features: ["pricing.feature.3a", "pricing.feature.3b", "pricing.feature.3c", "pricing.feature.3d", "pricing.feature.3e", "pricing.feature.3f", "pricing.feature.3g", "pricing.feature.3h", "pricing.feature.security", "pricing.feature.server", "pricing.feature.retainer"],
    popular: false,
    id: "enterprise",
  },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Pricing() {
  const { t } = useI18n();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ratiosRef = useRef<Record<string, number>>({});
  const [focusedPlanId, setFocusedPlanId] = useState<string | null>(null);

  useEffect(() => {
    const refs = cardRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = refs.findIndex((r) => r === entry.target);
          if (idx >= 0 && plans[idx]) ratiosRef.current[plans[idx].id] = entry.intersectionRatio;
        });
        const entries_ = Object.entries(ratiosRef.current);
        const best = entries_.reduce((a, b) => (a[1] >= b[1] ? a : b), ["", 0]);
        setFocusedPlanId(best[1] > 0.15 ? best[0] : null);
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], rootMargin: "-15% 0px -15% 0px" }
    );
    refs.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <PageWrapper>
      <SEOHead title="Pricing Plans" path="/pricing" />
      <div className="min-h-screen text-foreground font-sans antialiased">
        <Navbar />

        <main id="main-content">
          <section className="pt-safe-md pb-20 sm:pb-28 relative" data-testid="section-pricing">
            <div className="absolute bottom-0 start-0 w-[400px] h-[400px] rounded-full bg-neon-cyan/8 blur-[100px] pointer-events-none" />
            <div className="absolute top-1/4 end-0 w-[300px] h-[300px] rounded-full bg-neon-purple/6 blur-[80px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-20"
              >
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-slate-500">
                  {t("pricing.title").split(" ")[0]}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.02em] text-white mt-3 mb-3" data-testid="text-pricing-title">
                  {t("pricing.title").split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="gradient-text">{t("pricing.title").split(" ").pop()}</span>
                </h1>
                <div className="w-10 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mx-auto mb-5" />
                {t("pricing.subtitle") && (
                  <p className="text-slate-400 max-w-xl mx-auto text-base leading-[1.65]">
                    {t("pricing.subtitle")}
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
              >
                {plans.map((plan, idx) => {
                  const isFocused = focusedPlanId === plan.id;
                  const focusedOrHover = "group-hover:text-slate-900 group-hover:font-medium";
                  return (
                  <motion.div
                    key={plan.id}
                    ref={(el) => { cardRefs.current[idx] = el; }}
                    variants={itemVariants}
                    className={`group relative rounded-2xl border border-white/[0.06] backdrop-blur-[12px] p-6 sm:p-8 flex flex-col transition-all duration-300 hover:border-white/10 hover:bg-white/[0.08] hover:shadow-xl hover:shadow-black/15 hover:scale-[1.02] hover:backdrop-blur-md ${isFocused ? "bg-white/[0.06]" : plan.popular ? "bg-white/[0.04]" : "bg-white/[0.02]"} ${
                      plan.popular ? "md:-mt-2 md:mb-[-8px] ring-1 ring-neon-purple/40" : ""
                    }`}
                    data-testid={`card-pricing-${plan.id}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 start-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-lg">
                          <Star className="w-3.5 h-3.5" />
                          {t("pricing.popular")}
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-1.5 tracking-tight" data-testid={`text-plan-name-${plan.id}`}>
                        {t(plan.nameKey)}
                      </h3>
                      <p className={`text-sm leading-relaxed transition-colors duration-300 text-slate-200 ${focusedOrHover} ${isFocused ? "text-slate-900 font-medium" : ""}`}>
                        {t(plan.descKey)}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((fKey) => (
                        <li key={fKey} className={`flex items-start gap-3 text-sm leading-snug transition-colors duration-300 text-slate-200 ${focusedOrHover} ${isFocused ? "text-slate-900 font-medium" : ""}`}>
                          <Check className={`w-4 h-4 mt-0.5 shrink-0 transition-colors duration-300 ${plan.popular ? "text-neon-cyan" : "text-slate-400 group-hover:text-slate-600"} ${isFocused && !plan.popular ? "text-slate-600" : ""}`} />
                          {t(fKey)}
                        </li>
                      ))}
                    </ul>

                    <Link href={`/contact?plan=${plan.id}`}>
                      {plan.popular ? (
                        <Button
                          className="w-full rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 py-6 text-sm font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                          data-testid={`button-plan-${plan.id}`}
                        >
                          {t("pricing.selectPlan")}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full rounded-xl border-white/15 text-slate-300 py-6 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 hover:text-white transition-colors duration-200"
                          data-testid={`button-plan-${plan.id}`}
                        >
                          {t("pricing.selectPlan")}
                        </Button>
                      )}
                    </Link>
                  </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
