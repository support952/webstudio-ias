import { Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLenis } from "@/lib/lenis";

export type LogoVariant = "dark" | "light";

interface LogoProps {
  /** dark = white text (on dark bg), light = dark text (on light bg) */
  variant?: LogoVariant;
  /** Link to home - set to false to render as div */
  href?: string | false;
  className?: string;
  iconClassName?: string;
  /** Show as link with hover (default true when href is "/") */
  asLink?: boolean;
}

export function Logo({
  variant = "dark",
  href = "/",
  className = "",
  iconClassName = "",
  asLink = true,
}: LogoProps) {
  const [location] = useLocation();
  const lenis = useLenis();
  const isHome = location === "/";

  const handleClick = (e: React.MouseEvent) => {
    if (href === "/" && isHome) {
      e.preventDefault();
      lenis?.scrollTo(0, { duration: 1.2 });
    }
  };

  const textClass = variant === "dark" ? "text-white" : "text-slate-800";
  const content = (
    <>
      <Zap className={`w-7 h-7 shrink-0 text-neon-cyan ${iconClassName}`} strokeWidth={2.25} />
      <span
        className={`text-lg font-bold tracking-tight h-8 flex items-center ${textClass}`}
        style={{ lineHeight: 1 }}
      >
        WebStudio
      </span>
    </>
  );
  const linkClass =
    "inline-flex items-center gap-2.5 min-h-0 leading-none cursor-pointer transition-transform duration-200 hover:scale-105 origin-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md " +
    className;
  const sharedClass = `inline-flex items-center gap-2.5 min-h-0 leading-none ${className}`;

  if (href && asLink) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={linkClass}
        aria-label="Scroll to top"
        data-testid="link-logo"
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={sharedClass} aria-label="Scroll to top" data-testid="link-logo">
        {content}
      </a>
    );
  }

  return <div className={sharedClass}>{content}</div>;
}
