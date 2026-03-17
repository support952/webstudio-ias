"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Building2, Cloud, Cpu, Zap, Shield, Hexagon } from "lucide-react";

const clients = [
  { name: "TechCorp", icon: Building2 },
  { name: "InnovateLabs", icon: Cpu },
  { name: "CloudBase", icon: Cloud },
  { name: "DataFlow", icon: Shield },
  { name: "NexGen", icon: Zap },
  { name: "QuantumAI", icon: Hexagon },
];

/** Each card gets unique position, rotation, animation delay for scattered 3D floating */
const CARD_POSITIONS = [
  { top: "8%",  left: "5%",  rotate: -3,  delay: 0,    duration: 5   },
  { top: "15%", left: "65%", rotate: 2,   delay: 0.8,  duration: 6   },
  { top: "45%", left: "10%", rotate: -1,  delay: 1.5,  duration: 5.5 },
  { top: "50%", left: "72%", rotate: 3,   delay: 0.4,  duration: 6.5 },
  { top: "75%", left: "25%", rotate: -2,  delay: 1.2,  duration: 5.8 },
  { top: "70%", left: "55%", rotate: 1.5, delay: 2,    duration: 6.2 },
];

function FloatingCard({
  name,
  icon: Icon,
  position,
  index,
}: {
  name: string;
  icon: typeof Building2;
  position: (typeof CARD_POSITIONS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="trust-floating-card absolute"
      style={{
        top: position.top,
        left: position.left,
        transform: `rotate(${position.rotate}deg)`,
        animationDelay: `${position.delay}s`,
        animationDuration: `${position.duration}s`,
      }}
      data-testid={`text-client-${name.toLowerCase()}`}
    >
      <div className="trust-floating-pill select-none flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/80 backdrop-blur-xl px-5 py-3 shadow-lg">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan/25 to-neon-purple/25 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-neon-cyan/90" aria-hidden />
        </div>
        <span className="font-semibold text-sm sm:text-base tracking-tight text-foreground whitespace-nowrap">
          {name}
        </span>
      </div>
    </motion.div>
  );
}

export function TrustSection() {
  const { t } = useI18n();

  return (
    <section
      className="section-spacing relative overflow-hidden bg-transparent"
      data-testid="section-trust"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="trust-title-glow text-center text-section-label font-medium text-foreground uppercase tracking-[0.2em] mb-0 relative z-10"
        >
          {t("trust.title")}
        </motion.p>

        <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[500px]">
          {clients.map((client, i) => (
            <FloatingCard
              key={client.name}
              name={client.name}
              icon={client.icon}
              position={CARD_POSITIONS[i]}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
