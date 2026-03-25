import { motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";

export default function CookiePolicy() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <SEOHead title="Cookie Policy" path="/cookie-policy" />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section id="main-content" className="pt-safe-lg pb-16 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-neon-cyan text-sm font-medium uppercase tracking-widest">
                {t("cookies.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-cookies-title">
                {t("cookies.title")}
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg" data-testid="text-cookies-subtitle">
                {t("cookies.subtitle")}
              </p>
              <p className="text-slate-500 text-sm mt-4">{t("cookies.lastUpdated")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-md p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-md bg-emerald-400/10 flex items-center justify-center mt-1">
                  <Cookie className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                    {t("cookies.content")}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 glass-card rounded-md p-6 sm:p-8 text-center"
            >
              <h2 className="text-lg font-semibold text-white mb-2">{t("cookies.contact.title")}</h2>
              <p className="text-slate-400 text-sm mb-4">{t("cookies.contact.description")}</p>
              <a href="https://mail.google.com/mail/?view=cm&to=support%40webstudio-ias.com" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline text-sm font-medium">
                <span dir="ltr">support@webstudio-ias.com</span>
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}
