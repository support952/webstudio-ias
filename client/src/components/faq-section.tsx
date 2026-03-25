import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const faqKeys = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
  { q: "faq.q7", a: "faq.a7" },
  { q: "faq.q8", a: "faq.a8" },
  { q: "faq.q9", a: "faq.a9" },
] as const;

const springChevron = {
  type: "spring" as const,
  stiffness: 500,
  damping: 35,
};

export function FAQSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className="section-spacing relative overflow-visible bg-transparent"
      data-testid="section-faq"
    >
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="text-section-label font-medium tracking-[0.2em] uppercase text-foreground">
            {t("faq.label")}
          </span>
          <h2 className="text-section-title font-semibold tracking-tight text-foreground mt-3 mb-3">
            {t("faq.title")}
          </h2>
          <p className="text-foreground/90 text-base">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          {faqKeys.map(({ q, a }, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={q} className="faq-item">
                <motion.button
                  type="button"
                  onClick={() => handleToggle(i)}
                  className={`faq-question-bar w-full flex items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-4 text-start glass-float min-h-[52px] sm:min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99] touch-manipulation ${
                    isOpen ? "rounded-t-xl rounded-b-none" : "rounded-xl"
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.998 }}
                  transition={{ duration: 0.2 }}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-trigger-${i}`}
                >
                  <span className="font-semibold text-foreground text-[15px] sm:text-base pe-2 text-start">
                    {t(q)}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={springChevron}
                    className={`shrink-0 min-w-[28px] min-h-[28px] flex items-center justify-center transition-colors duration-200 ${
                      isOpen ? "text-primary" : "text-muted-foreground"
                    }`}
                    aria-hidden
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div className="faq-answer-content glass-float rounded-t-none rounded-b-xl border-t-0 px-4 py-4 sm:px-6 sm:py-5">
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed text-start">
                          {t(a)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
