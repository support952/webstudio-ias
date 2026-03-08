"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export interface MarketingDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  { titleKey: "marketing.details.s1.title", descKey: "marketing.details.s1.desc" },
  { titleKey: "marketing.details.s2.title", descKey: "marketing.details.s2.desc" },
  { titleKey: "marketing.details.s3.title", descKey: "marketing.details.s3.desc" },
  { titleKey: "marketing.details.s4.title", descKey: "marketing.details.s4.desc" },
] as const;

export function MarketingDetailsModal({ open, onClose }: MarketingDetailsModalProps) {
  const { t } = useI18n();
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="marketing-details-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="marketing-details-title"
        >
          <motion.div
            key="marketing-details-content"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative w-full max-w-lg max-h-[90dvh] flex flex-col rounded-2xl border border-border bg-card/90 shadow-2xl overflow-hidden"
            style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close: large and accessible on mobile */}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 z-10 flex items-center justify-center w-12 h-12 sm:w-11 sm:h-11 rounded-full bg-background/90 border-2 border-border text-foreground hover:bg-accent hover:border-primary/50 shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={t("faq.close")}
            >
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>

            {/* Scrollable body */}
            <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 p-6 pt-14 sm:p-8 sm:pt-16">
              <h2
                id="marketing-details-title"
                className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 pr-10"
              >
                {t("marketing.details.title")}
              </h2>
              <div className="space-y-5 sm:space-y-6">
                {SECTIONS.map(({ titleKey, descKey }) => (
                  <div key={titleKey}>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {t(titleKey)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(descKey)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
