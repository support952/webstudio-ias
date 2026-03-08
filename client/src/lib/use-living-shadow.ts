import { useCallback, useEffect, useRef, useState } from "react";

export type UseLivingShadowOptions = {
  /** Only run when element is in view (IntersectionObserver). Default true. */
  whenInView?: boolean;
  /** Root margin for in-view detection. Default "80px". */
  rootMargin?: string;
  /** Min shadow offset (px). Default 0. */
  offsetMin?: number;
  /** Max shadow offset (px). Default 14. */
  offsetMax?: number;
  /** Base blur (px). Default 18. */
  blurBase?: number;
  /** Extra blur range (px). Default 12. */
  blurRange?: number;
};

const defaultOptions: Required<UseLivingShadowOptions> = {
  whenInView: true,
  rootMargin: "80px",
  offsetMin: 0,
  offsetMax: 14,
  blurBase: 18,
  blurRange: 12,
};

/**
 * Updates --living-shadow-y and --living-shadow-blur on the element based on
 * scroll position. Only runs when in view (IntersectionObserver) and throttles
 * via requestAnimationFrame. Use with .living-shadow class in CSS.
 */
export function useLivingShadow<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options: UseLivingShadowOptions = {}
) {
  const opts = { ...defaultOptions, ...options };
  const [inView, setInView] = useState(false);
  const rafId = useRef<number | null>(null);

  const updateShadow = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const delta = centerY - viewportCenter;
    const t = Math.max(-1, Math.min(1, delta / (window.innerHeight * 0.5)));
    const offsetY = opts.offsetMin + (opts.offsetMax - opts.offsetMin) * (t * 0.5 + 0.5);
    const blur = opts.blurBase + opts.blurRange * (1 - Math.abs(t));
    el.style.setProperty("--living-shadow-y", `${Math.round(offsetY)}px`);
    el.style.setProperty("--living-shadow-blur", `${Math.round(blur)}px`);
  }, [ref, opts.offsetMin, opts.offsetMax, opts.blurBase, opts.blurRange]);

  const onScroll = useCallback(() => {
    if (!opts.whenInView || !inView) return;
    if (rafId.current != null) return;
    rafId.current = requestAnimationFrame(() => {
      updateShadow();
      rafId.current = null;
    });
  }, [inView, opts.whenInView, updateShadow]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05, rootMargin: opts.rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, opts.rootMargin]);

  useEffect(() => {
    if (!inView) {
      const el = ref.current;
      if (el) {
        el.style.setProperty("--living-shadow-y", "0px");
        el.style.setProperty("--living-shadow-blur", `${opts.blurBase}px`);
      }
      return;
    }
    updateShadow();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [inView, onScroll, updateShadow, opts.blurBase, ref]);
}
