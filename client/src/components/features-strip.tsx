import { motion } from "framer-motion";
import { Zap, Shield, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const FEATURES = [
  { icon: Zap, labelKey: "features.fast", descKey: "features.fastDesc", gradient: "from-amber-400 to-orange-500" },
  { icon: Shield, labelKey: "features.secure", descKey: "features.secureDesc", gradient: "from-neon-cyan to-emerald-500" },
  { icon: Sparkles, labelKey: "features.ai", descKey: "features.aiDesc", gradient: "from-neon-purple to-neon-pink" },
];

const stripVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const stripItemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

export function FeaturesStrip() {
  const { t } = useI18n();
  return (
    <section className="section-spacing relative bg-transparent">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stripVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {FEATURES.map(({ icon: Icon, labelKey, descKey, gradient }) => (
            <motion.div
              key={labelKey}
              variants={stripItemVariants}
              className="glass-float group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-2xl px-5 py-4 sm:px-6 sm:py-5 transition-all duration-300 hover:border-primary/30"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 animate-float`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold text-foreground tracking-tight block">{t(labelKey)}</span>
                <span className="text-xs text-muted-foreground mt-0.5 block">{t(descKey)}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
