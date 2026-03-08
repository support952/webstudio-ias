"use client";

import { ReactLenis } from "lenis/react";

const defaultOptions = {
  lerp: 0.08,
  duration: 1.2,
  smoothWheel: true,
  smoothTouch: false,
};

type LenisProviderProps = {
  children: React.ReactNode;
  options?: Parameters<typeof ReactLenis>[0]["options"];
};

/**
 * Wraps the app with Lenis smooth scroll. Use root so the instance
 * controls the document scroll (no extra wrapper div).
 */
export function LenisProvider({ children, options }: LenisProviderProps) {
  return (
    <ReactLenis root options={{ ...defaultOptions, ...options }}>
      {children}
    </ReactLenis>
  );
}

export { useLenis } from "lenis/react";
