import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

/** ISO 3166-1 alpha-2 codes for visual flag images (flagcdn.com). */
const FLAG_CODES = [
  "us", "gb", "de", "fr", "il", "jp", "in", "br", "au", "ca", "es", "it", "nl", "se", "pl", "mx",
  "kr", "cn", "za", "ae", "sg", "at", "be", "pt", "ie", "no", "fi", "dk", "gr", "tr", "ro", "cz", "hu", "nz", "ar", "cl", "co", "eg", "th", "vn",
];

const FLAG_BASE = "https://flagcdn.com";
/** Flagcdn.com only supports fixed sizes: 16x12, 20x15, 24x18, 32x24, 40x30, 48x36, 64x48, etc. */
const FLAG_SIZES = {
  small: "24x18",   // mobile
  medium: "32x24",  // default
  large: "64x48",   // 2x retina
} as const;

function flagSrc(code: string, size: keyof typeof FLAG_SIZES) {
  return `${FLAG_BASE}/${FLAG_SIZES[size]}/${code}.png`;
}

/** Duplicated list for seamless infinite loop (keyframes translate -50%). */
const FLAGS_DOUBLED = [...FLAG_CODES, ...FLAG_CODES];

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
      <p className="global-reach-message text-center text-muted-foreground mb-6 px-4">
        {t("globalReach.message")}
      </p>
      <div className="global-reach-track-wrap relative overflow-hidden flex items-center min-h-[32px] sm:min-h-[40px] pointer-events-none">
        <div
          className="carousel-track flex items-center gap-2 sm:gap-3 w-max animate-flags-scroll"
          style={{ willChange: "transform", backfaceVisibility: "hidden" }}
        >
          {FLAGS_DOUBLED.map((code, i) => (
            <span
              key={`${code}-${i}`}
              className="flag-item inline-flex items-center justify-center shrink-0 w-8 h-6 sm:w-[43px] sm:h-8"
            >
              <img
                src={flagSrc(code, "large")}
                srcSet={`${flagSrc(code, "small")} 1x, ${flagSrc(code, "medium")} 1.33x, ${flagSrc(code, "large")} 2x`}
                alt=""
                width={32}
                height={24}
                loading="lazy"
                decoding="async"
                className="flag-img block w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
