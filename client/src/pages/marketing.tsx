import { motion } from "framer-motion";
import { Search, Share2, MousePointerClick, Mail, BarChart3, Palette, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";

const services = [
  { icon: Search, titleKey: "marketing.detail.s1.title", descKey: "marketing.detail.s1.desc", color: "from-neon-purple to-neon-cyan" },
  { icon: Share2, titleKey: "marketing.detail.s2.title", descKey: "marketing.detail.s2.desc", color: "from-neon-cyan to-neon-pink" },
  { icon: MousePointerClick, titleKey: "marketing.detail.s3.title", descKey: "marketing.detail.s3.desc", color: "from-neon-pink to-neon-purple" },
  { icon: Mail, titleKey: "marketing.detail.s4.title", descKey: "marketing.detail.s4.desc", color: "from-neon-purple to-neon-cyan" },
  { icon: BarChart3, titleKey: "marketing.detail.s5.title", descKey: "marketing.detail.s5.desc", color: "from-neon-cyan to-neon-pink" },
  { icon: Palette, titleKey: "marketing.detail.s6.title", descKey: "marketing.detail.s6.desc", color: "from-neon-pink to-neon-purple" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Marketing() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <SEOHead title="Digital Marketing" path="/marketing" />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <main id="main-content" className="pt-safe-lg pb-16 sm:pb-20 relative">
          <div className="absolute top-20 end-0 w-[400px] h-[400px] rounded-full bg-neon-pink/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-[500px] h-[500px] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-neon-pink text-sm font-medium uppercase tracking-widest">
                {t("marketing.banner.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-marketing-title">
                {t("marketing.detail.title").split(" ").slice(0, -1).join(" ")}{" "}
                <span className="gradient-text">{t("marketing.detail.title").split(" ").pop()}</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
                {t("marketing.detail.subtitle")}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((svc, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="glass-card rounded-md p-6 group transition-all duration-300 hover:ring-1 hover:ring-white/[0.08]"
                  data-testid={`card-marketing-service-${i}`}
                >
                  <div className={`w-12 h-12 rounded-md bg-gradient-to-br ${svc.color} flex items-center justify-center mb-4`}>
                    <svc.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t(svc.titleKey)}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{t(svc.descKey)}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-16"
            >
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate px-8"
                  data-testid="button-marketing-contact"
                >
                  {t("hero.cta2")}
                  <ArrowRight className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden />
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
