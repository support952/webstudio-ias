import { useEffect, useCallback } from "react";
import { X, Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export interface BrowserSimulatorProps {
  open: boolean;
  onClose: () => void;
  /** Path to show in address bar and load in iframe (e.g. /demos/websites) */
  url: string;
  /** Optional title for the window (e.g. "Websites Demo") */
  title?: string;
}

export function BrowserSimulator({ open, onClose, url, title }: BrowserSimulatorProps) {
  const { t } = useI18n();
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "webstudio-close-demo") onClose();
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? t("demo.browserWindow")}
    >
      <div
        className="w-full max-w-5xl h-[85vh] flex flex-col rounded-xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser title bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-800/90 border-b border-white/10 shrink-0">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/90" aria-hidden />
            <span className="w-3 h-3 rounded-full bg-amber-500/90" aria-hidden />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90" aria-hidden />
          </div>
          <div className="flex-1 flex items-center gap-2 min-w-0 mx-4 py-1.5 px-3 rounded-lg bg-slate-950/80 border border-white/10">
            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-400 text-sm truncate font-mono" title={fullUrl}>
              {fullUrl}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={t("demo.closeWindow")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* iframe: demo content */}
        <div className="flex-1 min-h-0 bg-white">
          <iframe
            src={url}
            title={title ?? url}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
