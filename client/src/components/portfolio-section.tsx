import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { projectsData } from "@/data/projectsData";
import { ProjectCard } from "@/components/project-card";
import type { SupportedLanguage } from "@/data/projectsData";

/** 3-monitor arc: left tilted, center hero, right tilted */
const transforms = [
  { rotateY: 15, x: "4%", scale: 0.88, z: 1 },
  { rotateY: 0, x: "0%", scale: 1.06, z: 3 },
  { rotateY: -15, x: "-4%", scale: 0.88, z: 1 },
] as const;

/** Fixed side monitors */
const LEFT_IDX = 3;  // Yachad Lechaim
const RIGHT_IDX = 4; // LJB Commercial Gas
const SIDE_SET = new Set([LEFT_IDX, RIGHT_IDX]);
const TOTAL = projectsData.length;

/** Advance index, skipping side monitors */
function nextCenter(current: number, dir: 1 | -1): number {
  let next = ((current + dir) % TOTAL + TOTAL) % TOTAL;
  for (let i = 0; i < TOTAL; i++) {
    if (!SIDE_SET.has(next)) return next;
    next = ((next + dir) % TOTAL + TOTAL) % TOTAL;
  }
  return next;
}

/** Shared ease curve */
const EASE = [0.22, 1, 0.36, 1] as const;

export function PortfolioSection() {
  const { t, lang } = useI18n();
  const isRtl = lang === "he";

  // ── Desktop state ──
  const [centerIdx, setCenterIdx] = useState(0);
  const hoveringRef = useRef(false);

  // ── Mobile state ──
  const [mobileIdx, setMobileIdx] = useState(0);
  const mobilePausedRef = useRef(false);

  // ── Desktop derived ──
  const centerProject = projectsData[centerIdx];
  const { title, description } =
    centerProject?.translations[lang as SupportedLanguage] ??
    centerProject?.translations.en ??
    { title: "", description: "" };

  // ── Mobile derived ──
  const mobileProject = projectsData[mobileIdx];
  const mobileT =
    mobileProject?.translations[lang as SupportedLanguage] ??
    mobileProject?.translations.en ??
    { title: "", description: "" };

  // ── Desktop handlers ──
  const navigate = useCallback((dir: 1 | -1) => {
    hoveringRef.current = true;
    setTimeout(() => { hoveringRef.current = false; }, 6000);
    setCenterIdx((prev) => nextCenter(prev, dir));
  }, []);

  // ── Desktop auto-rotate: 5s ──
  useEffect(() => {
    const id = setInterval(() => {
      if (!hoveringRef.current) setCenterIdx((prev) => nextCenter(prev, 1));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // ── Mobile auto-rotate: 7s ──
  useEffect(() => {
    const id = setInterval(() => {
      if (!mobilePausedRef.current) setMobileIdx((prev) => (prev + 1) % TOTAL);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  // ── Mobile swipe handler ──
  const handleMobileSwipe = useCallback((_e: unknown, info: { offset: { x: number } }) => {
    mobilePausedRef.current = true;
    const threshold = 40;
    if (info.offset.x < -threshold) {
      setMobileIdx((prev) => (prev + 1) % TOTAL);
    } else if (info.offset.x > threshold) {
      setMobileIdx((prev) => ((prev - 1) + TOTAL) % TOTAL);
    }
  }, []);

  const handleMobileDotClick = useCallback((idx: number) => {
    mobilePausedRef.current = true;
    setMobileIdx(idx);
  }, []);

  const visibleIndices = [LEFT_IDX, centerIdx, RIGHT_IDX];

  return (
    <section
      className="section-spacing relative overflow-x-clip bg-transparent"
      dir={isRtl ? "rtl" : "ltr"}
      data-testid="section-portfolio"
      aria-labelledby="portfolio-heading"
    >
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-16 text-center sm:mb-24"
        >
          <span className="text-section-label font-medium uppercase tracking-[0.2em] text-foreground">
            {t("portfolio.label")}
          </span>
          <h2
            id="portfolio-heading"
            className="text-section-title mt-3 mb-3 font-semibold tracking-tight text-foreground"
          >
            {t("portfolio.title")}
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            {t("portfolio.subtitle")}
          </p>
        </motion.div>

        {/* ── 3-Monitor Arc — Desktop ── */}
        <div
          className="relative mx-auto hidden md:block"
          style={{ perspective: "1000px" }}
          onMouseEnter={() => { hoveringRef.current = true; }}
          onMouseLeave={() => { hoveringRef.current = false; }}
        >
          <div className="relative flex items-end justify-center">
            {visibleIndices.map((projectIdx, slot) => {
              const t3d = transforms[slot];
              const isCenter = slot === 1;
              return (
                <div
                  key={slot}
                  className="relative w-[37%] shrink-0 will-change-transform"
                  style={{
                    zIndex: t3d.z,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${t3d.rotateY}deg) translateX(${t3d.x}) scale(${t3d.scale})`,
                  }}
                >
                  {isCenter ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={projectIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.8, ease: EASE }}
                        className="will-change-[opacity,transform]"
                      >
                        <ProjectCard project={projectsData[projectIdx]} showInfo={false} />
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <ProjectCard project={projectsData[projectIdx]} showInfo={false} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-2 h-px w-[55%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        </div>

        {/* ── Center info + nav arrows — Desktop ── */}
        <div className="mx-auto mt-12 hidden max-w-lg md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={centerIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8, ease: EASE }}
              className={`will-change-[opacity,transform] ${isRtl ? "text-right" : "text-center"}`}
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
                {centerProject?.category}
              </p>
              <h3 className="mt-1.5 text-xl font-bold text-foreground">{title}</h3>
              <p className={`mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2 ${
                isRtl ? "" : "mx-auto max-w-md"
              }`}>
                {description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className={`mt-5 flex items-center gap-3 ${isRtl ? "justify-end" : "justify-center"}`}>
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground/60 transition-all duration-200 hover:border-neon-cyan/30 hover:text-neon-cyan hover:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              aria-label="Previous project"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <a
              href={centerProject?.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-xs font-medium text-neon-cyan/70 transition-all duration-300 hover:gap-2.5 hover:text-neon-cyan ${
                isRtl ? "flex-row-reverse" : ""
              }`}
            >
              {isRtl ? "צפה בפרויקט" : "View Project"}
              {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </a>

            <button
              onClick={() => navigate(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-muted-foreground/60 transition-all duration-200 hover:border-neon-cyan/30 hover:text-neon-cyan hover:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
              aria-label="Next project"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Mobile — Single rotating iPhone ── */}
        <div className="flex flex-col items-center md:hidden">
          <div className="w-[80%] max-w-[260px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileIdx}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleMobileSwipe}
                onTouchStart={() => { mobilePausedRef.current = true; }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="cursor-grab active:cursor-grabbing will-change-[opacity,transform]"
              >
                <ProjectCard project={mobileProject} showInfo={false} device="phone" />
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mobileIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6 w-full text-center"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/50">
                {mobileProject?.category}
              </p>
              <h3 className="mt-1.5 text-base font-bold text-foreground">{mobileT.title}</h3>
              <p className="mx-auto mt-1.5 max-w-[85%] text-[13px] leading-relaxed text-muted-foreground/80 line-clamp-2">
                {mobileT.description}
              </p>
              <a
                href={mobileProject?.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3.5 inline-flex items-center gap-1.5 text-xs font-medium text-neon-cyan/70 transition-all duration-300 ${
                  isRtl ? "flex-row-reverse" : ""
                }`}
              >
                {isRtl ? "צפה בפרויקט" : "View Project"}
                {isRtl ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              </a>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 flex gap-1.5">
            {projectsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleMobileDotClick(idx)}
                className={`h-2 min-w-[8px] rounded-full transition-all duration-300 ${
                  idx === mobileIdx ? "w-5 bg-neon-cyan" : "w-2 bg-white/[0.12]"
                }`}
                aria-label={`Project ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Credibility badge */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center text-[10px] tracking-widest text-muted-foreground/30 uppercase sm:mt-20"
        >
          Built with WebStudio &middot; Deliveries updated weekly
        </motion.p>
      </div>
    </section>
  );
}
