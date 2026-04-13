import { motion } from "framer-motion";
import { Search, PenTool, Code2, Rocket } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const steps = [
  { num: "01", icon: Search, titleKey: "process.step1.title", descKey: "process.step1.desc" },
  { num: "02", icon: PenTool, titleKey: "process.step2.title", descKey: "process.step2.desc" },
  { num: "03", icon: Code2, titleKey: "process.step3.title", descKey: "process.step3.desc" },
  { num: "04", icon: Rocket, titleKey: "process.step4.title", descKey: "process.step4.desc" },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7 } },
};

export function ProcessSection() {
  const { t, lang } = useI18n();
  const isRtl = false;

  return (
    <section
      className="section-spacing relative bg-transparent"
      dir={isRtl ? "rtl" : "ltr"}
      data-testid="section-process"
    >
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center sm:mb-24"
        >
          <span className="text-section-label font-medium uppercase tracking-[0.2em] text-foreground">
            {t("process.label")}
          </span>
          <h2 className="text-section-title mt-3 mb-3 font-semibold tracking-tight text-foreground">
            {t("process.title")}
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground">
            {t("process.subtitle")}
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                variants={itemVariants}
                className="flex flex-col items-center text-center"
              >
                {/* Step badge */}
                <span className="mb-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.1] text-[10px] font-medium text-muted-foreground/50">
                  {step.num}
                </span>

                {/* Icon */}
                <Icon className="mb-4 h-5 w-5 text-neon-cyan" />

                {/* Title */}
                <h3 className="text-[15px] font-bold text-foreground">
                  {t(step.titleKey)}
                </h3>

                {/* Description */}
                <p className="mt-2 max-w-[220px] text-[13px] leading-[1.8] text-muted-foreground">
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
