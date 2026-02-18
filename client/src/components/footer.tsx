import { Zap, Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  const columns = [
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.aboutUs"), href: "/about" },
        { label: t("footer.careers"), href: "#" },
        { label: t("footer.blog"), href: "#" },
        { label: t("footer.press"), href: "#" },
      ],
    },
    {
      title: t("footer.services"),
      links: [
        { label: t("footer.webDev"), href: "/services" },
        { label: t("footer.aiAuto"), href: "/services" },
        { label: t("footer.uiux"), href: "/services" },
        { label: t("footer.marketing"), href: "/services" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("footer.docs"), href: "#" },
        { label: t("footer.helpCenter"), href: "#" },
        { label: t("footer.community"), href: "#" },
        { label: t("footer.sitemap"), href: "#" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacy"), href: "/privacy-policy" },
        { label: t("footer.refund"), href: "/refund-policy" },
        { label: t("footer.terms"), href: "#" },
        { label: t("footer.cookies"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/[0.06]" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16 grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">WebStudio</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-4">
              {t("footer.tagline")}
            </p>
            <a
              href="mailto:support@webstudio-ias.com"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-neon-cyan transition-colors mb-6"
              data-testid="link-footer-email"
            >
              <Mail className="w-4 h-4" />
              support@webstudio-ias.com
            </a>
            <div className="flex items-center gap-3">
              {[
                { icon: SiX, label: "X" },
                { icon: SiGithub, label: "GitHub" },
                { icon: SiLinkedin, label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-9 h-9 rounded-md glass-card flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-200"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600" data-testid="text-footer-copyright">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center flex-wrap gap-4 text-xs text-slate-600">
            <Link href="/privacy-policy" className="hover:text-slate-400 transition-colors" data-testid="link-footer-bottom-privacy">{t("footer.privacy")}</Link>
            <Link href="/refund-policy" className="hover:text-slate-400 transition-colors" data-testid="link-footer-bottom-refund">{t("footer.refund")}</Link>
            <a href="#" className="hover:text-slate-400 transition-colors" data-testid="link-footer-bottom-terms">{t("footer.terms")}</a>
            <a href="#" className="hover:text-slate-400 transition-colors" data-testid="link-footer-bottom-cookies">{t("footer.cookies")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
