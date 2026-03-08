"use client";

import React, { useEffect, useRef, useState } from "react";

export type OrbitParams = {
  radiusX: number;
  radiusY: number;
  speed: number;
  phase: number;
  depth: number;
};

/**
 * Runs a single RAF loop that updates multiple elements' transforms for orbital motion.
 * Uses translate3d for GPU. cardRefs.current is an array of DOM elements (length = orbits.length).
 */
export function useOrbitConstellation(
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  orbits: OrbitParams[],
  enabled: boolean
) {
  const rafId = useRef<number | null>(null);
  const start = useRef(0);
  const orbitsRef = useRef(orbits);
  orbitsRef.current = orbits;

  useEffect(() => {
    if (!enabled || orbits.length === 0) return;

    start.current = performance.now();

    const tick = (now: number) => {
      const t = (now - start.current) / 1000;
      const orbits = orbitsRef.current;
      const arr = cardRefs.current;
      for (let i = 0; i < orbits.length; i++) {
        const el = arr[i];
        if (!el) continue;
        const { radiusX, radiusY, speed, phase, depth } = orbits[i];
        const angle = speed * t + phase;
        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle);
        const scale = 0.7 + 0.3 * depth;
        const opacity = 0.72 + 0.28 * depth;
        el.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) scale(${scale})`;
        el.style.opacity = String(opacity);
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [enabled]);
}

export function useIsMobile(breakpoint = 768): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setMobile(mq.matches);
    const fn = () => setMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [breakpoint]);
  return mobile;
}
