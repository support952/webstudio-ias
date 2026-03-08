import { motion } from "framer-motion";
import { RefreshCw, CheckCircle, ClipboardList, Clock, XCircle, Ban, Mail } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";

const sections = [
  { icon: RefreshCw, titleKey: "refund.section1.title", contentKey: "refund.section1.content", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  { icon: CheckCircle, titleKey: "refund.section2.title", contentKey: "refund.section2.content", color: "text-neon-purple", bg: "bg-neon-purple/10" },
  { icon: ClipboardList, titleKey: "refund.section3.title", contentKey: "refund.section3.content", color: "text-neon-pink", bg: "bg-neon-pink/10" },
  { icon: Clock, titleKey: "refund.section4.title", contentKey: "refund.section4.content", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { icon: XCircle, titleKey: "refund.section5.title", contentKey: "refund.section5.content", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  { icon: Ban, titleKey: "refund.section6.title", contentKey: "refund.section6.content", color: "text-neon-purple", bg: "bg-neon-purple/10" },
  { icon: Mail, titleKey: "refund.section7.title", contentKey: "refund.section7.content", color: "text-neon-pink", bg: "bg-neon-pink/10" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function RefundPolicy() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <SEOHead title="Refund Policy" path="/refund-policy" />
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
                {t("refund.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-refund-title">
                {t("refund.title").split(" ")[0]}{" "}
                <span className="gradient-text">{t("refund.title").split(" ").slice(1).join(" ")}</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg" data-testid="text-refund-subtitle">
                {t("refund.subtitle")}
              </p>
              <p className="text-slate-500 text-sm mt-4" data-testid="text-refund-last-updated">
                {t("refund.lastUpdated")}
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
                  data-testid={`card-refund-section-${index + 1}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-10 h-10 rounded-md ${section.bg} flex items-center justify-center mt-1`}>
                      <section.icon className={`w-5 h-5 ${section.color}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white mb-3" data-testid={`text-refund-section-${index + 1}-title`}>
                        {t(section.titleKey)}
                      </h2>
                      <p className="text-slate-400 leading-relaxed text-sm" data-testid={`text-refund-section-${index + 1}-content`}>
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
              data-testid="card-refund-contact"
            >
              <h2 className="text-lg font-semibold text-white mb-2">{t("refund.contact.title")}</h2>
              <p className="text-slate-400 text-sm mb-4">{t("refund.contact.description")}</p>
              <a
                href="mailto:support@webstudio-ias.com"
                className="text-neon-cyan hover:underline text-sm font-medium"
                data-testid="link-refund-contact-email"
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
