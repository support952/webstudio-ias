"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
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

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * Smooth scroll via Lenis. Mounted after first paint (idle) so initial JS execution / main-thread work stay lower.
 */
export function LenisProvider({ children, options }: LenisProviderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [enableLenis, setEnableLenis] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setEnableLenis(true), { timeout: 1800 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setEnableLenis(true), 0);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  if (reducedMotion || !enableLenis) {
    return <>{children}</>;
  }
  return (
    <ReactLenis root options={{ ...defaultOptions, ...options }}>
      {children}
    </ReactLenis>
  );
}

export { useLenis } from "lenis/react";
