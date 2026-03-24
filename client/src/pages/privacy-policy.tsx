import { motion } from "framer-motion";
import { Shield, Eye, Lock, Cookie, Globe, Users, FileText, Mail } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";

const sections = [
  { icon: Eye, titleKey: "privacy.section1.title", contentKey: "privacy.section1.content", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  { icon: FileText, titleKey: "privacy.section2.title", contentKey: "privacy.section2.content", color: "text-neon-purple", bg: "bg-neon-purple/10" },
  { icon: Lock, titleKey: "privacy.section3.title", contentKey: "privacy.section3.content", color: "text-neon-pink", bg: "bg-neon-pink/10" },
  { icon: Cookie, titleKey: "privacy.section4.title", contentKey: "privacy.section4.content", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { icon: Globe, titleKey: "privacy.section5.title", contentKey: "privacy.section5.content", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  { icon: Users, titleKey: "privacy.section6.title", contentKey: "privacy.section6.content", color: "text-neon-purple", bg: "bg-neon-purple/10" },
  { icon: Shield, titleKey: "privacy.section7.title", contentKey: "privacy.section7.content", color: "text-neon-pink", bg: "bg-neon-pink/10" },
  { icon: Mail, titleKey: "privacy.section8.title", contentKey: "privacy.section8.content", color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function PrivacyPolicy() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <SEOHead title="Privacy Policy" path="/privacy-policy" />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section id="main-content" className="pt-32 pb-16 sm:pt-40 sm:pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-neon-cyan text-sm font-medium uppercase tracking-widest">
                {t("privacy.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-privacy-title">
                {t("privacy.title").split(" ")[0]}{" "}
                <span className="gradient-text">{t("privacy.title").split(" ").slice(1).join(" ")}</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg" data-testid="text-privacy-subtitle">
                {t("privacy.subtitle")}
              </p>
              <p className="text-slate-500 text-sm mt-4" data-testid="text-privacy-last-updated">
                {t("privacy.lastUpdated")}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {sections.map((section, index) => (
                <motion.div
                  key={section.titleKey}
                  variants={itemVariants}
                  className="glass-card rounded-md p-6 sm:p-8"
                  data-testid={`card-privacy-section-${index + 1}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-md ${section.bg} flex items-center justify-center mt-1`}>
                      <section.icon className={`w-5 h-5 ${section.color}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-3" data-testid={`text-privacy-section-${index + 1}-title`}>
                        {t(section.titleKey)}
                      </h2>
                      <p className="text-slate-400 leading-relaxed text-sm" data-testid={`text-privacy-section-${index + 1}-content`}>
                        {t(section.contentKey)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 glass-card rounded-md p-6 sm:p-8 text-center"
              data-testid="card-privacy-contact"
            >
              <h2 className="text-lg font-semibold text-white mb-2">{t("privacy.contact.title")}</h2>
              <p className="text-slate-400 text-sm mb-4">{t("privacy.contact.description")}</p>
              <a
                href="https://mail.google.com/mail/?view=cm&to=support%40webstudio-ias.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:underline text-sm font-medium"
                data-testid="link-privacy-contact-email"
              >
                support@webstudio-ias.com
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}
