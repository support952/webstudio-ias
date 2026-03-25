import { motion } from "framer-motion";
import { Search, PenTool, Code2, Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const steps = [
  { num: "01", icon: Search, titleKey: "process.step1.title", descKey: "process.step1.desc", color: "from-neon-cyan to-neon-purple" },
  { num: "02", icon: PenTool, titleKey: "process.step2.title", descKey: "process.step2.desc", color: "from-neon-purple to-neon-pink" },
  { num: "03", icon: Code2, titleKey: "process.step3.title", descKey: "process.step3.desc", color: "from-neon-pink to-neon-cyan" },
  { num: "04", icon: Rocket, titleKey: "process.step4.title", descKey: "process.step4.desc", color: "from-neon-cyan to-neon-purple" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function ProcessSection() {
  const { t } = useI18n();

  return (
    <section className="section-spacing relative bg-transparent" data-testid="section-process">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-section-label font-medium tracking-[0.2em] uppercase text-foreground">
            {t("process.label")}
          </span>
          <h2 className="text-section-title font-semibold tracking-tight text-foreground mt-3 mb-3">
            {t("process.title")}
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            {t("process.subtitle")}
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative"
        >
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-16 start-[12.5%] end-[12.5%] h-px bg-gradient-to-r from-neon-cyan/20 via-neon-purple/30 to-neon-cyan/20" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                variants={itemVariants}
                className="glass-float rounded-2xl p-6 text-center relative z-10"
              >
                {/* Gradient number circle */}
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <span className="text-sm font-bold text-white">{step.num}</span>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 text-neon-cyan" />
                </div>

                {/* Title */}
                <h3 className="text-foreground font-semibold text-base mb-2">
                  {t(step.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(step.descKey)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
