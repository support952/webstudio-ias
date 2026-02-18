import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { useI18n } from "@/lib/i18n";

const plans = [
  {
    nameKey: "pricing.starter",
    descKey: "pricing.starter.desc",
    priceKey: "pricing.starter.price",
    features: ["pricing.feature.1a", "pricing.feature.1b", "pricing.feature.1c", "pricing.feature.1d", "pricing.feature.1e"],
    popular: false,
    id: "starter",
  },
  {
    nameKey: "pricing.pro",
    descKey: "pricing.pro.desc",
    priceKey: "pricing.pro.price",
    features: ["pricing.feature.2a", "pricing.feature.2b", "pricing.feature.2c", "pricing.feature.2d", "pricing.feature.2e", "pricing.feature.2f", "pricing.feature.2g"],
    popular: true,
    id: "pro",
  },
  {
    nameKey: "pricing.enterprise",
    descKey: "pricing.enterprise.desc",
    priceKey: "pricing.enterprise.price",
    features: ["pricing.feature.3a", "pricing.feature.3b", "pricing.feature.3c", "pricing.feature.3d", "pricing.feature.3e", "pricing.feature.3f", "pricing.feature.3g", "pricing.feature.3h"],
    popular: false,
    id: "enterprise",
  },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Pricing() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section className="pt-32 pb-24 sm:pt-40 sm:pb-32 relative">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-neon-pink text-sm font-medium uppercase tracking-widest">
                {t("pricing.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-pricing-title">
                {t("pricing.title").split(" ").slice(0, -1).join(" ")}{" "}
                <span className="gradient-text">{t("pricing.title").split(" ").pop()}</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
                {t("pricing.subtitle")}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
            >
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  variants={itemVariants}
                  className={`relative glass-card rounded-md p-6 sm:p-8 flex flex-col transition-all duration-300 ${
                    plan.popular ? "md:-mt-4 md:mb-[-16px] ring-1 ring-neon-purple/30" : ""
                  }`}
                  data-testid={`card-pricing-${plan.id}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-neon-purple to-neon-cyan text-white">
                        <Star className="w-3 h-3" />
                        {t("pricing.popular")}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-1" data-testid={`text-plan-name-${plan.id}`}>
                      {t(plan.nameKey)}
                    </h3>
                    <p className="text-sm text-slate-400">{t(plan.descKey)}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white" data-testid={`text-plan-price-${plan.id}`}>
                      {t(plan.priceKey)}
                    </span>
                    <span className="text-slate-500 ms-2 text-sm">/{t("pricing.perProject")}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((fKey) => (
                      <li key={fKey} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-neon-cyan" : "text-slate-500"}`} />
                        {t(fKey)}
                      </li>
                    ))}
                  </ul>

                  <Link href={`/checkout?plan=${plan.id}`}>
                    {plan.popular ? (
                      <Button
                        className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
                        data-testid={`button-plan-${plan.id}`}
                      >
                        {t("pricing.selectPlan")}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full border-slate-700 text-slate-300 no-default-hover-elevate no-default-active-elevate bg-transparent"
                        data-testid={`button-plan-${plan.id}`}
                      >
                        {t("pricing.selectPlan")}
                      </Button>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}
