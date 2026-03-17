import { Mail } from "lucide-react";
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
      title: t("footer.products"),
      links: [
        { label: t("footer.productWebsites"), href: "/products" },
        { label: t("footer.productMarketing"), href: "/products" },
        { label: t("footer.productCard"), href: "/products" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacy"), href: "/privacy-policy" },
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
              href="https://mail.google.com/mail/?view=cm&to=support%40webstudio-ias.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              data-testid="link-footer-email"
            >
              <Mail className="w-4 h-4 opacity-80" />
              support@webstudio-ias.com
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-5">{col.title}</h4>
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
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors duration-200" data-testid="link-footer-bottom-terms">{t("footer.terms")}</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors duration-200" data-testid="link-footer-bottom-cookies">{t("footer.cookies")}</Link>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
