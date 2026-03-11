"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Building2, Cloud, Cpu, Zap, Shield, Hexagon } from "lucide-react";
import { TiltCard } from "@/components/tilt-card";
import {
  useOrbitConstellation,
  useIsMobile,
  type OrbitParams,
} from "@/lib/use-orbit-constellation";

const clients = [
  { name: "TechCorp", icon: Building2, iconAnim: null as string | null },
  { name: "InnovateLabs", icon: Cpu, iconAnim: "trust-icon-rotate" },
  { name: "CloudBase", icon: Cloud, iconAnim: null },
  { name: "DataFlow", icon: Shield, iconAnim: "trust-icon-pulse" },
  { name: "NexGen", icon: Zap, iconAnim: null },
  { name: "QuantumAI", icon: Hexagon, iconAnim: "trust-icon-rotate" },
];

/** Unique orbital params per card: elliptical path, speed, phase, depth (scale/opacity). */
const ORBIT_PARAMS: OrbitParams[] = [
  { radiusX: 140, radiusY: 98, speed: 0.36, phase: 0, depth: 0.92 },
  { radiusX: 118, radiusY: 128, speed: -0.3, phase: 1.6, depth: 0.58 },
  { radiusX: 155, radiusY: 88, speed: 0.42, phase: 3.2, depth: 0.78 },
  { radiusX: 98, radiusY: 148, speed: -0.38, phase: 4.8, depth: 0.52 },
  { radiusX: 148, radiusY: 108, speed: 0.32, phase: 2.1, depth: 1 },
  { radiusX: 128, radiusY: 118, speed: -0.34, phase: 5.2, depth: 0.68 },
];

function TrustCardContent({
  name,
  icon: Icon,
  iconAnim,
}: {
  name: string;
  icon: typeof Building2;
  iconAnim: string | null;
}) {
  return (
    <div
      className="trust-constellation-card select-none flex items-center gap-3 px-4 py-3 rounded-xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-constellation"
      data-testid={`text-client-${name.toLowerCase()}`}
    >
      <div
        className={`w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan/25 to-neon-purple/25 flex items-center justify-center shrink-0 ${iconAnim ?? ""}`}
      >
        <Icon className="w-4 h-4 text-neon-cyan/90" aria-hidden />
      </div>
      <span className="font-semibold text-sm sm:text-base tracking-tight text-foreground whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export function TrustSection() {
  const { t } = useI18n();
  const isMobile = useIsMobile(768);
  const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(6).fill(null) as (HTMLDivElement | null)[]);
  useOrbitConstellation(cardRefs, ORBIT_PARAMS, !isMobile);

  const setRef = (i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el;
  };

  return (
    <section
      className="trust-galaxy section-spacing relative overflow-hidden bg-transparent"
      data-testid="section-trust"
    >
      <div className="absolute inset-0 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="trust-title-glow text-center text-section-label font-medium text-foreground uppercase tracking-[0.2em] mb-0 relative z-10"
        >
          {t("trust.title")}
        </motion.p>

        {isMobile ? (
          <div className="trust-mobile-stream w-full max-w-xs mx-auto mt-8 space-y-4">
            {clients.map((client, i) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="trust-mobile-card"
              >
                <TrustCardContent
                  name={client.name}
                  icon={client.icon}
                  iconAnim={client.iconAnim}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="trust-orbit-zone relative w-full max-w-4xl mx-auto h-[380px] sm:h-[420px] lg:h-[460px]">
            {clients.map((client, i) => (
              <div
                key={client.name}
                ref={setRef(i)}
                className="trust-orbit-card absolute left-1/2 top-1/2 w-max"
                style={{ willChange: "transform" }}
              >
                <TiltCard maxTilt={10} className="w-full" stiffness={180} damping={22}>
                  <TrustCardContent
                    name={client.name}
                    icon={client.icon}
                    iconAnim={client.iconAnim}
                  />
                </TiltCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
