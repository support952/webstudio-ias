import { Zap } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-bold text-white">WebStudio</span>
          </div>

          <p className="text-sm text-slate-500 text-center" data-testid="text-footer-copyright">
            2025 WebStudio. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {[
              { icon: SiX, href: "#", label: "X" },
              { icon: SiGithub, href: "#", label: "GitHub" },
              { icon: SiLinkedin, href: "#", label: "LinkedIn" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-9 h-9 rounded-md glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-200"
                aria-label={social.label}
                data-testid={`link-social-${social.label.toLowerCase()}`}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
