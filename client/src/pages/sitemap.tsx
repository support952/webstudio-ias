import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";

const mainLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/services", labelKey: "nav.services" },
  { href: "/work", labelKey: "nav.work" },
  { href: "/pricing", labelKey: "nav.pricing" },
  { href: "/contact", labelKey: "nav.contact" },
  { href: "/marketing", labelKey: "footer.marketing" },
];

const legalLinks = [
  { href: "/privacy-policy", labelKey: "footer.privacy" },
  { href: "/refund-policy", labelKey: "footer.refund" },
  { href: "/terms-of-service", labelKey: "footer.terms" },
  { href: "/cookie-policy", labelKey: "footer.cookies" },
];

export default function SitemapPage() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <SEOHead title="Sitemap" path="/sitemap" />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <main id="main-content" className="pt-32 pb-16 sm:pt-40 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-neon-cyan text-sm font-medium uppercase tracking-widest">
                {t("sitemap.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold mt-3 mb-4" data-testid="text-sitemap-title">
                {t("sitemap.title")}
              </h1>
              <p className="text-slate-400 max-w-xl mx-auto text-sm">
                {t("sitemap.subtitle")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              <div className="glass-card rounded-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Map className="w-5 h-5 text-neon-cyan" />
                  <h2 className="text-lg font-semibold text-white">{t("sitemap.main")}</h2>
                </div>
                <ul className="space-y-2">
                  {mainLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-neon-cyan transition-colors text-sm"
                      >
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card rounded-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Map className="w-5 h-5 text-neon-purple" />
                  <h2 className="text-lg font-semibold text-white">{t("footer.legal")}</h2>
                </div>
                <ul className="space-y-2">
                  {legalLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-neon-cyan transition-colors text-sm"
                      >
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
