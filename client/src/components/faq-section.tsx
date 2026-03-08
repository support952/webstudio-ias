import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const faqKeys = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
] as const;

const springBubbleIn = {
  type: "spring",
  stiffness: 380,
  damping: 24,
  mass: 0.9,
};

const springChevron = {
  type: "spring",
  stiffness: 500,
  damping: 35,
};

export function FAQSection() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const closeBubble = () => setOpenIndex(null);

  useEffect(() => {
    if (openIndex === null) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (bubbleRef.current?.contains(target)) return;
      const trigger = document.getElementById(`faq-trigger-${openIndex}`);
      if (trigger?.contains(target)) return;
      closeBubble();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [openIndex]);

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
          className="text-center mb-12"
        >
          <span className="text-section-label font-medium tracking-[0.2em] uppercase text-primary">
            {t("faq.label")}
          </span>
          <h2 className="text-section-title font-bold tracking-tight text-foreground mt-3 mb-3">
            {t("faq.title")}
          </h2>
          <p className="text-muted-foreground text-base">
            {t("faq.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          {faqKeys.map(({ q, a }, i) => (
            <div key={q} className="relative">
              <AnimatePresence mode="wait">
                {openIndex === i && (
                  <motion.div
                    ref={bubbleRef}
                    id={`faq-bubble-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={springBubbleIn}
                    className="faq-bubble-3d absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-[100] w-[95%] max-w-full sm:w-full sm:left-0 sm:right-0 sm:translate-x-0 lg:max-w-[800px]"
                  >
                    <div className="faq-bubble-inner relative text-left p-6 sm:p-8 min-h-[44px]">
                      <button
                        type="button"
                        onClick={closeBubble}
                        className="faq-bubble-close absolute top-3 right-3 sm:top-4 sm:right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors z-10"
                        aria-label={t("faq.close")}
                      >
                        <X className="w-5 h-5" aria-hidden />
                      </button>
                      <div className="faq-bubble-safe pt-14 sm:pt-16">
                        <p className="faq-bubble-text text-foreground">
                          {t(a)}
                        </p>
                      </div>
                    </div>
                    <div className="faq-bubble-tail" aria-hidden />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={() => handleToggle(i)}
                className="faq-question-bar w-full flex items-center justify-between gap-4 rounded-xl px-5 py-4 sm:px-6 sm:py-4 text-left glass-float min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.99]"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.998 }}
                animate={{
                  opacity: openIndex === null ? 1 : openIndex === i ? 0.9 : 0.45,
                  scale: openIndex === null ? 1 : openIndex === i ? 0.99 : 0.98,
                }}
                transition={{ duration: 0.2 }}
                aria-expanded={openIndex === i}
                aria-controls={`faq-bubble-${i}`}
                id={`faq-trigger-${i}`}
              >
                <span className="font-semibold text-foreground text-[15px] sm:text-base pr-2">
                  {t(q)}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={springChevron}
                  className={`shrink-0 transition-colors duration-200 ${openIndex === i ? "text-primary" : "text-muted-foreground"}`}
                >
                  <ChevronDown className="w-5 h-5" aria-hidden />
                </motion.span>
              </motion.button>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
