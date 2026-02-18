import { motion } from "framer-motion";
import { Code2, BrainCircuit, Palette, Megaphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";

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
    <section className="relative py-24 sm:py-32" data-testid="section-services-overview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-neon-cyan text-sm font-medium uppercase tracking-widest">
            {t("servicesOverview.label")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            {t("servicesOverview.title").split(" ")[0]}{" "}
            <span className="gradient-text">{t("servicesOverview.title").split(" ").slice(1).join(" ")}</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            {t("servicesOverview.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.titleKey}
              variants={itemVariants}
              className="group glass-card rounded-md p-6 transition-all duration-300 gradient-border"
              data-testid={`card-service-overview-${service.titleKey}`}
            >
              <div className={`w-12 h-12 rounded-md bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{t(service.titleKey)}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{t(service.descKey)}</p>
              <Link href="/services">
                <Button variant="ghost" size="sm" className="text-neon-cyan p-0 h-auto">
                  {t("servicesOverview.learnMore")}
                  <ArrowRight className="w-3 h-3 ms-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
