import { Mail, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/logo";
import { CtaBanner } from "@/components/cta-banner";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

export function Footer() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [path] = useLocation();
  const showCta = path !== "/contact";

  if (user) return null;

  const columns = [
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.aboutUs"), href: "/about" },
      ],
    },
    {
      title: t("footer.services"),
      links: [
        { label: t("footer.webDev"), href: "/services" },
        { label: t("footer.aiAuto"), href: "/services" },
        { label: t("footer.uiux"), href: "/services" },
        { label: t("footer.marketing"), href: "/marketing" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("footer.sitemap"), href: "/sitemap" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacy"), href: "/privacy-policy" },
        { label: t("footer.refund"), href: "/refund-policy" },
        { label: t("footer.terms"), href: "/terms-of-service" },
        { label: t("footer.cookies"), href: "/cookie-policy" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-visible bg-transparent" data-testid="footer">
      {showCta && <CtaBanner />}
      <div className="relative bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-14 sm:py-16 grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-12">
          <div className="col-span-2">
            <Logo href="/" variant={theme === "light" ? "light" : "dark"} className="mb-5" />
            <p className="text-sm text-muted-foreground leading-[1.65] max-w-xs mb-5">
              {t("footer.tagline")}
            </p>
            <a
              href="mailto:support@webstudio-ias.com"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              data-testid="link-footer-email"
            >
              <Mail className="w-4 h-4 opacity-80" />
              support@webstudio-ias.com
            </a>
            <div className="flex items-center gap-3 mt-4" aria-label="Social media links">
              <a href="https://www.linkedin.com/company/webstudio-ias" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              <a href="https://twitter.com/webstudio_ias" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href="https://www.instagram.com/webstudio_ias" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/webstudio.ias" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-muted-foreground mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
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

        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground tracking-wide" data-testid="text-footer-copyright">
            © {new Date().getFullYear()} {t("footer.copyrightCompany")}
          </p>
          <div className="flex items-center flex-wrap gap-6 text-xs text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors duration-200" data-testid="link-footer-bottom-privacy">{t("footer.privacy")}</Link>
            <Link href="/refund-policy" className="hover:text-foreground transition-colors duration-200" data-testid="link-footer-bottom-refund">{t("footer.refund")}</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors duration-200" data-testid="link-footer-bottom-terms">{t("footer.terms")}</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors duration-200" data-testid="link-footer-bottom-cookies">{t("footer.cookies")}</Link>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
