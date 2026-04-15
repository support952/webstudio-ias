import { useState, useEffect, useRef } from "react";
import { Accessibility } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "a11y-settings";

interface A11ySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  underlineLinks: boolean;
}

const defaults: A11ySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  underlineLinks: false,
};

function load(): A11ySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

function apply(s: A11ySettings) {
  const cl = document.documentElement.classList;
  cl.toggle("a11y-high-contrast", s.highContrast);
  cl.toggle("a11y-large-text", s.largeText);
  cl.toggle("a11y-reduced-motion", s.reducedMotion);
  cl.toggle("a11y-underline-links", s.underlineLinks);
}

const OPTIONS: { key: keyof A11ySettings; label: string }[] = [
  { key: "highContrast", label: "High Contrast" },
  { key: "largeText", label: "Large Text" },
  { key: "reducedMotion", label: "Reduce Motion" },
  { key: "underlineLinks", label: "Underline Links" },
];

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(defaults);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = load();
    setSettings(s);
    apply(s);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  const toggle = (key: keyof A11ySettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    apply(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const reset = () => {
    setSettings(defaults);
    apply(defaults);
    localStorage.removeItem(STORAGE_KEY);
  };

  const anyActive = Object.values(settings).some(Boolean);

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className={`text-muted-foreground hover:text-foreground ${anyActive ? "text-neon-cyan" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label="Accessibility settings"
        aria-expanded={open}
      >
        <Accessibility className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 top-full mt-2 w-52 rounded-xl border border-border bg-card shadow-xl z-50 p-2"
          >
            <p className="text-xs font-medium text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
              Accessibility
            </p>
            {OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                className="w-full flex items-center justify-between gap-2 px-2 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
              >
                <span className="text-foreground">{label}</span>
                <span
                  className={`w-8 h-[18px] rounded-full relative transition-colors ${
                    settings[key] ? "bg-neon-cyan" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${
                      settings[key] ? "translate-x-[16px]" : "translate-x-[2px]"
                    }`}
                  />
                </span>
              </button>
            ))}
            {anyActive && (
              <button
                type="button"
                onClick={reset}
                className="w-full mt-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground text-center rounded-lg hover:bg-accent transition-colors"
              >
                Reset all
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
