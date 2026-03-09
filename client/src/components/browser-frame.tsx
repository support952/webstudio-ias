import { Lock } from "lucide-react";

interface BrowserFrameProps {
  children: React.ReactNode;
  url?: string;
  title?: string;
  className?: string;
}

export function BrowserFrame({ children, url = "https://shop-demo.webstudio.co.il", title = "ShopDemo", className = "" }: BrowserFrameProps) {
  return (
    <div
      className={`preserve-dark-ui overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/40 ${className}`}
      style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}
    >
      {/* Title bar - traffic lights + URL bar */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-slate-800/90 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 rounded-lg bg-slate-700/80 px-4 py-1.5 min-w-0 max-w-md flex-1 justify-center">
            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-slate-300 text-sm truncate font-mono">{url}</span>
          </div>
        </div>
        <div className="w-12 shrink-0" />
      </div>

      {/* Viewport */}
      <div className="bg-slate-950 overflow-hidden rounded-b-xl min-h-[400px] max-h-[85vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
