import { motion } from "framer-motion";
import { Code2, BrainCircuit, Palette, Megaphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { useI18n } from "@/lib/i18n";

const services = [
  { icon: Code2, titleKey: "services.web.title", descKey: "services.web.desc", longKey: "services.web.long", gradient: "from-neon-purple to-blue-500" },
  { icon: BrainCircuit, titleKey: "services.ai.title", descKey: "services.ai.desc", longKey: "services.ai.long", gradient: "from-neon-cyan to-emerald-500" },
  { icon: Palette, titleKey: "services.design.title", descKey: "services.design.desc", longKey: "services.design.long", gradient: "from-neon-pink to-rose-500" },
  { icon: Megaphone, titleKey: "services.marketing.title", descKey: "services.marketing.desc", longKey: "services.marketing.long", gradient: "from-amber-400 to-orange-500" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Services() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section className="pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-neon-cyan text-sm font-medium uppercase tracking-widest">
                {t("services.page.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-services-title">
                {t("services.page.title").split(" ")[0]}{" "}
                <span className="gradient-text">{t("services.page.title").split(" ").slice(1).join(" ")}</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
                {t("services.page.subtitle")}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {services.map((service, idx) => (
                <motion.div
                  key={service.titleKey}
                  variants={itemVariants}
                  className="glass-card rounded-md p-6 sm:p-8 gradient-border"
                  data-testid={`card-service-detail-${idx}`}
                >
                  <div className={`flex flex-col md:flex-row gap-6 ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                    <div className="shrink-0 flex items-start">
                      <div className={`w-16 h-16 rounded-md bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{t(service.titleKey)}</h2>
                      <p className="text-slate-400 leading-relaxed mb-4">{t(service.longKey)}</p>
                      <Link href="/contact">
                        <Button
                          className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
                          data-testid={`button-service-cta-${idx}`}
                        >
                          {t("nav.getStarted")}
                          <ArrowRight className="w-4 h-4 ms-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}
