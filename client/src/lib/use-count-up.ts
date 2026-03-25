import { useEffect, useRef, useState } from "react";

/** Parse value string like "150+", "99%", "5+" into number and suffix */
function parseValue(str: string): { num: number; suffix: string } {
  const match = str.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: str };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

/**
 * Count-up for hero stats. Uses IntersectionObserver (no framer-motion) to keep main-thread work low.
 */
export function useCountUp(
  valueStr: string,
  ref: React.RefObject<HTMLElement | null>,
  duration = 1.2
): string {
  const { num, suffix } = parseValue(valueStr);
  const [display, setDisplay] = useState(0);
  const [inView, setInView] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { root: null, rootMargin: "0px", threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    let start: number;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - (1 - progress) ** 2;
      setDisplay(Math.round(num * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, num, duration]);

  return display + suffix;
}
