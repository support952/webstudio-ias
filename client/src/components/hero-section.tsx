import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { HeroLogoParallax } from "@/components/hero-logo-parallax";
import { useCountUp } from "@/lib/use-count-up";
import { useTheme } from "@/lib/theme";

function HeroMeshBackground({ isLight }: { isLight: boolean }) {
  const meshRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const o = Math.max(0.4, 1 - (y / 300) * 0.6);
      if (meshRef.current) meshRef.current.style.opacity = String(o);
      if (lightRef.current) lightRef.current.style.opacity = String(o);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div ref={meshRef} className="hero-canvas-mesh absolute inset-0" style={{ opacity: 1 }} />
      {isLight ? (
        <div
          ref={lightRef}
          className="absolute inset-0"
          style={{
            opacity: 1,
            background:
              "radial-gradient(ellipse 55% 40% at 50% 20%, rgba(168,85,247,0.30), transparent 70%), radial-gradient(ellipse 50% 35% at 80% 35%, rgba(6,182,212,0.24), transparent 72%), radial-gradient(ellipse 45% 32% at 20% 45%, rgba(99,102,241,0.22), transparent 72%)",
            mixBlendMode: "screen",
          }}
        />
      ) : null}
      <div
        className="absolute inset-0 opacity-[0.03] hero-grid-overlay"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="hero-blob hero-blob-purple absolute w-[500px] h-[500px] rounded-full blur-3xl" />
      <div className="hero-blob hero-blob-cyan absolute w-[400px] h-[400px] rounded-full blur-3xl" />
      <div className="hero-blob hero-blob-pink absolute w-[350px] h-[350px] rounded-full blur-3xl" />
    </div>
  );
}

const HERO_STATS = [
  { valueKey: "hero.stat1.value", labelKey: "hero.stat1.label", accent: "text-neon-cyan" },
  { valueKey: "hero.stat3.value", labelKey: "hero.stat3.label", accent: "text-emerald-400" },
  { valueKey: "hero.stat4.value", labelKey: "hero.stat4.label", accent: "text-amber-400" },
] as const;

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
  const { theme } = useTheme();
  const isLight = theme === "light";
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
      className="relative min-h-screen flex flex-col items-center justify-center pt-safe-nav overflow-hidden bg-transparent"
      data-testid="section-hero"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <HeroMeshBackground isLight={isLight} />
      <HeroLogoParallax mousePosition={mousePosition} />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 flex flex-col items-center text-center">
        <div className="mb-6 sm:mb-8">
          <span
            className="hero-badge-glass inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase text-foreground"
            data-testid="badge-hero-tag"
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            {t("hero.badge")}
          </span>
        </div>

        <h1
          className="hero-headline-boutique font-bold text-foreground mb-3 sm:mb-4"
          data-testid="text-hero-title"
        >
          {t("hero.title1")}{" "}
          <br className="hidden sm:block" />
          {t("hero.title2")}{" "}
          <span className="hero-gradient-text hero-headline-shimmer">{t("hero.title3")}</span>
            <svg
              className="hero-lightning-bolt inline-block align-middle ms-2"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M13 2L4.09 12.64a1 1 0 0 0 .78 1.63H11l-1 7.27a.5.5 0 0 0 .86.42L19.91 11.36a1 1 0 0 0-.78-1.63H13l1-7.27a.5.5 0 0 0-.86-.42z"
                fill="url(#bolt-gradient)"
                stroke="url(#bolt-stroke-gradient)"
                strokeWidth="0.5"
              />
              <defs>
                <linearGradient id="bolt-gradient" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
                <linearGradient id="bolt-stroke-gradient" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
        </h1>

        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-6 sm:mb-8" />

        <p
          className="hero-subtext text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 px-1"
          data-testid="text-hero-subtitle"
        >
          {t("hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href="/pricing">
            <Button
              size="lg"
              className="hero-cta-primary rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-primary-foreground border-0 px-6 sm:px-8 py-5 sm:py-6 text-sm font-semibold tracking-wide shadow-[0_8px_30px_rgba(139,92,246,0.35)]"
              data-testid="button-get-started"
            >
              {t("hero.cta1")}
              <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="hero-cta-secondary rounded-xl border-2 border-primary text-foreground hover:bg-primary/10 px-6 sm:px-8 py-5 sm:py-6 font-semibold tracking-wide transition-colors duration-200"
              data-testid="button-contact-hero"
            >
              <Play className="w-4 h-4 me-2" />
              {t("hero.cta2")}
            </Button>
          </Link>
        </div>
      </div>

      <div
        ref={statsRef}
        className="relative z-10 mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-3xl mx-auto px-4"
      >
        {HERO_STATS.map(({ valueKey, labelKey, accent }) => (
          <HeroStat key={valueKey} valueKey={valueKey} labelKey={labelKey} accent={accent} statsRef={statsRef} />
        ))}
      </div>
    </section>
  );
}
