import { motion } from "framer-motion";
import { Code2, BrainCircuit, Palette, Megaphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { TiltCard } from "@/components/tilt-card";

const services = [
  { icon: Code2, titleKey: "services.web.title", descKey: "services.web.desc", gradient: "from-neon-purple to-blue-500" },
  { icon: BrainCircuit, titleKey: "services.ai.title", descKey: "services.ai.desc", gradient: "from-neon-cyan to-emerald-500" },
  { icon: Palette, titleKey: "services.design.title", descKey: "services.design.desc", gradient: "from-neon-pink to-rose-500" },
  { icon: Megaphone, titleKey: "services.marketing.title", descKey: "services.marketing.desc", gradient: "from-amber-400 to-orange-500" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };

export function ServicesOverview() {
  const { t } = useI18n();

  return (
    <section className="section-spacing relative overflow-hidden bg-transparent" data-testid="section-services-overview">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="text-section-label font-medium tracking-[0.2em] uppercase text-foreground">
            {t("servicesOverview.label")}
          </span>
          <h2 className="text-section-title font-semibold tracking-tight text-foreground mt-3 mb-3">
            {t("servicesOverview.title").split(" ")[0]}{" "}
            <span className="gradient-text">{t("servicesOverview.title").split(" ").slice(1).join(" ")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-neon-purple/40 to-transparent mx-auto mb-5" />
          <p className="text-section-subtitle text-muted-foreground max-w-xl mx-auto">
            {t("servicesOverview.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch"
        >
          {services.map((service) => (
            <motion.div key={service.titleKey} variants={itemVariants}>
              <TiltCard
                className="group rounded-2xl card-futuristic p-6 sm:p-7 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.12)]"
                maxTilt={6}
              >
                <div data-testid={`card-service-overview-${service.titleKey}`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 shadow-[0_0_24px_rgba(6,182,212,0.25)] group-hover:shadow-[0_0_28px_rgba(139,92,246,0.3)] transition-shadow duration-300`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2.5 tracking-tight">{t(service.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-[1.6] mb-5">{t(service.descKey)}</p>
                  <Link href="/services">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary p-0 min-h-[48px] h-auto text-sm font-medium group-hover:translate-x-1 transition-all duration-200 flex items-center">
                      {t("servicesOverview.learnMore")}
                      <ArrowRight className="w-3.5 h-3.5 ms-1.5" />
                    </Button>
                  </Link>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
