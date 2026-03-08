"use client";

import { useRef } from "react";
import { useLivingShadow, type UseLivingShadowOptions } from "@/lib/use-living-shadow";

type LivingShadowProps = UseLivingShadowOptions & {
  children: React.ReactNode;
  className?: string;
};

/**
 * Wraps content and applies a scroll-reactive box-shadow (living shadow).
 * Uses CSS variables --living-shadow-y and --living-shadow-blur; theme color
 * is set in index.css via --living-shadow-color (dark/light).
 */
export function LivingShadow({ children, className = "", ...options }: LivingShadowProps) {
  const ref = useRef<HTMLDivElement>(null);
  useLivingShadow(ref, options);
  return (
    <div ref={ref} className={`living-shadow ${className}`.trim()}>
      {children}
    </div>
  );
}
