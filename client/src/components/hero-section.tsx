import { useState, useCallback, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { HeroLogoParallax } from "@/components/hero-logo-parallax";
import { useCountUp } from "@/lib/use-count-up";

function HeroMeshBackground() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div style={{ opacity }} className="hero-canvas-mesh absolute inset-0" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}

const HERO_STATS = [
  { valueKey: "hero.stat1.value", labelKey: "hero.stat1.label", accent: "text-neon-cyan" },
  { valueKey: "hero.stat3.value", labelKey: "hero.stat3.label", accent: "text-emerald-400" },
  { valueKey: "hero.stat4.value", labelKey: "hero.stat4.label", accent: "text-amber-400" },
] as const;

const stagger = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

function HeroStat({ valueKey, labelKey, accent, statsRef }: {
  valueKey: (typeof HERO_STATS)[number]["valueKey"];
  labelKey: (typeof HERO_STATS)[number]["labelKey"];
  accent: string;
  statsRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { t } = useI18n();
  const display = useCountUp(t(valueKey), statsRef, 1.4);
  return (
    <div className="glass-float rounded-2xl px-4 py-5 sm:px-6 sm:py-6 text-center transition-all duration-300 hover:border-primary/30">
      <p className={`font-bold ${accent}`} style={{ fontSize: "clamp(1.5rem, 4vw + 1rem, 2.25rem)" }}>{display}</p>
      <p className="text-section-subtitle text-muted-foreground mt-1 font-medium">{t(labelKey)}</p>
    </div>
  );
}

export function HeroSection() {
  const { t } = useI18n();
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const onMouseLeave = useCallback(() => setMousePosition(null), []);

  return (
    <section
      data-hero-section
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-transparent"
      data-testid="section-hero"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <HeroMeshBackground />
      <HeroLogoParallax mousePosition={mousePosition} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...stagger, delay: 0 }}
          className="mb-6 sm:mb-8"
        >
          <span
            className="hero-badge-glass inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase text-foreground"
            data-testid="badge-hero-tag"
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            {t("hero.badge")}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...stagger, delay: 0.1 }}
          className="hero-headline-boutique font-bold text-foreground mb-3 sm:mb-4"
          data-testid="text-hero-title"
        >
          {t("hero.title1")}{" "}
          <br className="hidden sm:block" />
          {t("hero.title2")}{" "}
          <span className="hero-gradient-text hero-headline-shimmer">{t("hero.title3")}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-6 sm:mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...stagger, delay: 0.22 }}
          className="hero-subtext text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 px-1"
          data-testid="text-hero-subtitle"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...stagger, delay: 0.32 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link href="/pricing">
            <Button
              size="lg"
              className="hero-cta-primary rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-primary-foreground border-0 px-6 sm:px-8 py-5 sm:py-6 text-sm font-semibold tracking-wide shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
              data-testid="button-get-started"
            >
              {t("hero.cta1")}
              <ArrowRight className="w-4 h-4 ms-2" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="hero-cta-secondary glass-float rounded-xl text-foreground px-6 sm:px-8 py-5 sm:py-6"
              data-testid="button-contact-hero"
            >
              <Play className="w-4 h-4 me-2" />
              {t("hero.cta2")}
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        ref={statsRef}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-3xl mx-auto px-4"
      >
        {HERO_STATS.map(({ valueKey, labelKey, accent }) => (
          <HeroStat key={valueKey} valueKey={valueKey} labelKey={labelKey} accent={accent} statsRef={statsRef} />
        ))}
      </motion.div>
    </section>
  );
}
