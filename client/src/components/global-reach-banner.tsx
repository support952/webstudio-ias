import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

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

function FlagRow({ codes, idSuffix }: { codes: string[]; idSuffix: string }) {
  return (
    <div
      className="global-reach-flag-row flex items-center gap-2 sm:gap-3 shrink-0"
      aria-hidden={idSuffix === "b" ? true : undefined}
    >
      {codes.map((code) => (
        <span
          key={`${code}-${idSuffix}`}
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
  );
}

/**
 * Two identical rows, no gap between rows — so translateX(-50%) lands exactly on the loop seam
 * (flex `gap` between flags stays inside each row).
 */
export function GlobalReachBanner() {
  const { t } = useI18n();

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
      <div
        dir="ltr"
        className="global-reach-track-wrap relative w-full overflow-hidden flex items-center justify-start min-h-[64px] sm:min-h-[96px] pointer-events-none"
      >
        <div className="carousel-track flex flex-row flex-nowrap items-center w-max min-w-max shrink-0">
          <FlagRow codes={FLAG_CODES} idSuffix="a" />
          <FlagRow codes={FLAG_CODES} idSuffix="b" />
        </div>
      </div>
    </motion.section>
  );
}
