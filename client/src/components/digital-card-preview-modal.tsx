"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MessageCircle, Linkedin, UserPlus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const AVATAR_URL = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face";
const CARD_TILT = 12;
const PERSPECTIVE = 1200;

export interface DigitalCardPreviewModalProps {
  open: boolean;
  onClose: () => void;
}

function FloatingCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 22 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(x * CARD_TILT);
      rotateX.set(-y * CARD_TILT);
    },
    [rotateX, rotateY]
  );

  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        perspective: PERSPECTIVE,
        transformStyle: "preserve-3d",
        rotateX: springX,
        rotateY: springY,
        transform: "translate3d(0, 0, 0)",
      }}
    >
      <div style={{ transform: "translateZ(0)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

export function DigitalCardPreviewModal({ open, onClose }: DigitalCardPreviewModalProps) {
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
    const t = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(t);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="digital-card-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="digital-card-preview-title"
        >
          {/* Modal content: scale + fade (card floating into view) */}
          <motion.div
            key="digital-card-content"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="relative w-full max-w-md flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close: high contrast */}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute -top-2 -right-2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-card border-2 border-border text-foreground hover:bg-accent hover:border-primary/50 shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label={t("demo.closeWindow")}
            >
              <X className="w-5 h-5" />
            </button>

            {/* 3D floating card — theme-aware shadow */}
            <FloatingCard className="w-full max-w-[340px]">
              <div className="digital-card-preview-card relative rounded-[1.75rem] p-[2px] bg-gradient-to-br from-neon-cyan/50 via-neon-purple/40 to-neon-pink/50 shadow-2xl [data-theme=light]:from-neon-cyan/40 [data-theme=light]:via-neon-purple/30 [data-theme=light]:to-neon-pink/40">
              <div className="rounded-[calc(1.75rem-2px)] overflow-hidden bg-card border border-border">
                {/* Header strip */}
                <div className="h-20 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
                <div className="relative px-6 pb-6 -mt-12">
                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl border-4 border-card overflow-hidden shadow-xl ring-2 ring-primary/40 shrink-0">
                      <img
                        src={AVATAR_URL}
                        alt=""
                        width={96}
                        height={96}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2
                      id="digital-card-preview-title"
                      className="text-xl font-bold text-foreground mt-4 mb-0.5 tracking-tight"
                    >
                      Sarah J.
                    </h2>
                    <p className="text-primary text-sm font-semibold mb-0.5">Marketing Director</p>
                    <p className="text-muted-foreground text-xs mb-5">WebStudio</p>
                    <div className="w-full h-px bg-border mb-5" />
                    {/* Contact icons: hover effects */}
                    <div className="flex flex-wrap justify-center gap-3 w-full mb-5">
                      <a
                        href="mailto:sarah.j@webstudio-ias.com"
                        className="flex items-center justify-center min-w-[44px] h-11 rounded-xl bg-muted/80 hover:bg-primary/20 border border-border hover:border-primary/40 text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                        aria-label="Email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                      <a
                        href="tel:+1234567890"
                        className="flex items-center justify-center min-w-[44px] h-11 rounded-xl bg-muted/80 hover:bg-primary/20 border border-border hover:border-primary/40 text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
                        aria-label="Phone"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                      <a
                        href="https://wa.me/1234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center min-w-[44px] h-11 rounded-xl bg-muted/80 hover:bg-emerald-500/20 border border-border hover:border-emerald-500/40 text-foreground hover:text-emerald-400 transition-all duration-200 hover:scale-110"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </a>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center min-w-[44px] h-11 rounded-xl bg-muted/80 hover:bg-blue-500/20 border border-border hover:border-blue-500/40 text-foreground hover:text-blue-400 transition-all duration-200 hover:scale-110"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                    {/* Add to Contacts: hover animation */}
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm border-0 shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <UserPlus className="w-5 h-5" />
                      Add to Contacts
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </FloatingCard>

            <p className="text-muted-foreground text-xs mt-4 text-center max-w-xs">
              {t("demo.cardDisclaimer")}
            </p>
          </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
