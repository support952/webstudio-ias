import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const clients = [
  "TechCorp",
  "InnovateLabs",
  "CloudBase",
  "DataFlow",
  "NexGen",
  "QuantumAI",
];

export function TrustSection() {
  const { t } = useI18n();

  return (
    <section className="py-16 sm:py-20 border-t border-white/[0.04]" data-testid="section-trust">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-slate-500 uppercase tracking-widest mb-10"
        >
          {t("trust.title")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
        >
          {clients.map((name) => (
            <div
              key={name}
              className="text-slate-600 font-bold text-lg sm:text-xl tracking-wider select-none"
              data-testid={`text-client-${name.toLowerCase()}`}
            >
              {name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
