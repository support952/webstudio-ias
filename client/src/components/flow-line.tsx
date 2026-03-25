/**
 * Flow Line - decorative accent element (desktop: SVG line, mobile: soft glow)
 * Theme-aware via CSS vars (--flow-from, --flow-to, --flow-opacity)
 */
export function FlowLine() {
  return (
    <>
      {/* Desktop: SVG flowing line on the right side */}
      <div
        className="flow-line-desktop hidden lg:block"
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          insetInlineEnd: 0,
          width: 120,
          height: "100vh",
          minHeight: "100dvh",
          zIndex: 0,
          pointerEvents: "none",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        <svg
          viewBox="0 0 120 1000"
          preserveAspectRatio="none"
          className="flow-line-svg"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="hsl(var(--flow-from))" stopOpacity="var(--flow-opacity)" />
              <stop offset="100%" stopColor="hsl(var(--flow-to))" stopOpacity="var(--flow-opacity)" />
            </linearGradient>
          </defs>
          <path
            d="M 100 0 C 110 80, 100 200, 108 350 C 100 480, 112 600, 105 750 C 108 880, 102 950, 100 1000"
            fill="none"
            stroke="url(#flowGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="60 120"
            className="animate-flow-dash"
            style={{ willChange: "transform" }}
          />
        </svg>
      </div>

      {/* Mobile: soft glow orbs at top and middle */}
      <div
        className="flow-line-mobile lg:hidden"
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          className="flow-glow-top"
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(100%, 400px)",
            height: 200,
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--flow-from) / 0.12) 0%, hsl(var(--flow-to) / 0.06) 40%, transparent 70%)",
          }}
        />
        <div
          className="flow-glow-mid"
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(100%, 300px)",
            height: 150,
            background: "radial-gradient(ellipse 70% 50% at 50% 50%, hsl(var(--flow-from) / 0.08) 0%, hsl(var(--flow-to) / 0.04) 50%, transparent 80%)",
          }}
        />
      </div>
    </>
  );
}
