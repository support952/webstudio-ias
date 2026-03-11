import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** ISO 3166-1 alpha-2 codes for visual flag images (flagcdn.com). */
const FLAG_CODES = [
  "us", "gb", "de", "fr", "il", "jp", "in", "br", "au", "ca", "es", "it", "nl", "se", "pl", "mx",
  "kr", "cn", "za", "ae", "sg", "at", "be", "pt", "ie", "no", "fi", "dk", "gr", "tr", "ro", "cz", "hu", "nz", "ar", "cl", "co", "eg", "th", "vn",
];

const FLAG_BASE = "https://flagcdn.com";
/** Flagcdn.com fixed sizes – using highest res for crisp display on all screens */
const FLAG_SIZES = {
  small: "64x48",   // 1x baseline
  medium: "128x96", // 2x retina
  xlarge: "256x192",// 4x for high-DPI
} as const;

function flagSrc(code: string, size: keyof typeof FLAG_SIZES) {
  return `${FLAG_BASE}/${FLAG_SIZES[size]}/${code}.png`;
}

function flagSrcSet(code: string) {
  return `${flagSrc(code, "small")} 1x, ${flagSrc(code, "medium")} 2x, ${flagSrc(code, "xlarge")} 3x`;
}

/** Duplicated list for seamless infinite CSS loop (keyframes translate -50%). */
const FLAGS_DOUBLED = [...FLAG_CODES, ...FLAG_CODES];

export function GlobalReachBanner() {
  const { t } = useI18n();
  const [hoverDir, setHoverDir] = useState<"left" | "right" | null>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="global-reach-banner section-spacing relative overflow-hidden bg-transparent"
      aria-label="Global reach"
    >
      <p className="global-reach-message text-center text-foreground mb-6 px-4">
        {t("globalReach.message")}
      </p>
      <div className="global-reach-track-wrap relative overflow-hidden flex items-center min-h-[64px] sm:min-h-[96px] pointer-events-none">
        <div
          className={`carousel-track flex items-center gap-2 sm:gap-3 w-max ${hoverDir === "left" ? "reverse" : ""}`}
        >
          {FLAGS_DOUBLED.map((code, i) => (
            <span
              key={`${code}-${i}`}
              className="flag-item inline-flex items-center justify-center shrink-0 w-14 h-10 sm:w-[72px] sm:h-[54px] md:w-20 md:h-15"
            >
              <img
                src={flagSrc(code, "medium")}
                srcSet={flagSrcSet(code)}
                alt=""
                width={128}
                height={96}
                loading="lazy"
                decoding="async"
                className="flag-img block w-full h-full object-contain"
                style={{ imageRendering: "crisp-edges" as const }}
                referrerPolicy="no-referrer"
              />
            </span>
          ))}
        </div>
        {/* Arrow controls - pointer-events auto for interaction */}
        <button
          type="button"
          aria-label={t("globalReach.scrollLeft")}
          className="global-reach-arrow absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-sm border border-border/60 text-foreground hover:bg-accent hover:border-primary/30 transition-colors shadow-md pointer-events-auto touch-target"
          onMouseEnter={() => setHoverDir("left")}
          onMouseLeave={() => setHoverDir(null)}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden />
        </button>
        <button
          type="button"
          aria-label={t("globalReach.scrollRight")}
          className="global-reach-arrow absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-sm border border-border/60 text-foreground hover:bg-accent hover:border-primary/30 transition-colors shadow-md pointer-events-auto touch-target"
          onMouseEnter={() => setHoverDir("right")}
          onMouseLeave={() => setHoverDir(null)}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden />
        </button>
      </div>
    </motion.section>
  );
}
