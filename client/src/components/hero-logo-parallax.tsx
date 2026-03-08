"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Zap } from "lucide-react";

export type MousePosition = { x: number; y: number } | null;

/** Subtle 3D WebStudio lightning bolt in hero background. Parallax tilt from parent mouse; on mobile, slow auto float. */
export function HeroLogoParallax({ mousePosition }: { mousePosition: MousePosition }) {
  const [isMobile, setIsMobile] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 40, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    if (isMobile || !mousePosition) {
      rotateX.set(0);
      rotateY.set(0);
      return;
    }
    const x = (mousePosition.x - 0.5) * 10;
    const y = (mousePosition.y - 0.5) * -10;
    rotateX.set(y);
    rotateY.set(x);
  }, [isMobile, mousePosition, rotateX, rotateY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(80vw,520px)] h-[min(80vw,520px)] flex items-center justify-center text-neon-cyan/[0.07] hero-logo-bg"
        style={{
          rotateX: isMobile ? undefined : springX,
          rotateY: isMobile ? undefined : springY,
          perspective: 1200,
          transformStyle: "preserve-3d",
        }}
      >
        <Zap className="w-full h-full" strokeWidth={0.75} />
      </motion.div>
    </div>
  );
}
