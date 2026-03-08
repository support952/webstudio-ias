import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Parse value string like "150+", "99%", "5+" into number and suffix */
function parseValue(str: string): { num: number; suffix: string } {
  const match = str.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: str };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

export function useCountUp(
  valueStr: string,
  ref: React.RefObject<HTMLElement | null>,
  duration = 1.2
): string {
  const { num, suffix } = parseValue(valueStr);
  const [display, setDisplay] = useState(0);
  const isInView = useInView(ref ?? { current: null }, { once: true, amount: 0.3 });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;
    let start: number;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - (1 - progress) ** 2; // ease-out quad
      setDisplay(Math.round(num * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, num, duration]);

  return display + suffix;
}
