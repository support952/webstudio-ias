"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export type MousePosition = { x: number; y: number } | null;

/** Subtle 3D lightning bolt in hero. Pure CSS transform (no Framer) to reduce layout work on LCP. */
export function HeroLogoParallax({ mousePosition }: { mousePosition: MousePosition }) {
  const [isMobile, setIsMobile] = useState(false);
  const [rot, setRot] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    if (isMobile || !mousePosition) {
      setRot({ x: 0, y: 0 });
      return;
    }
    const rotateY = (mousePosition.x - 0.5) * 10;
    const rotateX = (mousePosition.y - 0.5) * -10;
    setRot({ x: rotateX, y: rotateY });
  }, [isMobile, mousePosition]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(80vw,520px)] h-[min(80vw,520px)] flex items-center justify-center text-neon-cyan/[0.07] hero-logo-bg transition-transform duration-150 ease-out"
        style={{
          transform: `perspective(1200px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <Zap className="w-full h-full" strokeWidth={0.75} />
      </div>
    </div>
  );
}
