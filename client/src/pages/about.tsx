import { motion } from "framer-motion";
import { Lightbulb, HeartHandshake, Award, Eye } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";

const values = [
  { icon: Lightbulb, titleKey: "about.values.v1.title", descKey: "about.values.v1.desc", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  { icon: HeartHandshake, titleKey: "about.values.v2.title", descKey: "about.values.v2.desc", color: "text-neon-purple", bg: "bg-neon-purple/10" },
  { icon: Award, titleKey: "about.values.v3.title", descKey: "about.values.v3.desc", color: "text-neon-pink", bg: "bg-neon-pink/10" },
  { icon: Eye, titleKey: "about.values.v4.title", descKey: "about.values.v4.desc", color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function About() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <SEOHead title="About Us" path="/about" />
      <div className="min-h-screen text-foreground font-sans antialiased">
        <Navbar />

        <main id="main-content">
          <section className="pt-safe-md pb-16 sm:pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-20"
              >
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-slate-500">
                  {t("about.label")}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.02em] text-white mt-3 mb-3" data-testid="text-about-title">
                  {t("about.title").split(" ")[0]}{" "}
                  <span className="gradient-text">{t("about.title").split(" ").slice(1).join(" ")}</span>
                </h1>
                <div className="w-10 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mx-auto mb-5" />
                <p className="text-slate-400 max-w-xl mx-auto text-base leading-[1.65]">
                  {t("about.subtitle")}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 transition-all duration-300 hover:border-white/[0.08] hover:shadow-xl hover:shadow-black/10"
                >
                  <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">{t("about.story.title")}</h2>
                  <p className="text-slate-400 leading-[1.65] mb-4">{t("about.story.p1")}</p>
                  <p className="text-slate-400 leading-[1.65]">{t("about.story.p2")}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8 flex flex-col justify-center transition-all duration-300 hover:border-white/[0.08] hover:shadow-xl hover:shadow-black/10"
                >
                  <h2 className="text-xl font-semibold text-white mb-4 tracking-tight">{t("about.mission.title")}</h2>
                  <p className="text-slate-400 leading-[1.65]">{t("about.mission.text")}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { valKey: "about.mission.stat1.val", labKey: "about.mission.stat1.lab" },
                      { valKey: "about.mission.stat2.val", labKey: "about.mission.stat2.lab" },
                      { valKey: "about.mission.stat3.val", labKey: "about.mission.stat3.lab" },
                      { valKey: "about.mission.stat4.val", labKey: "about.mission.stat4.lab" },
                      { valKey: "about.mission.stat5.val", labKey: "about.mission.stat5.lab" },
                      { valKey: "about.mission.stat6.val", labKey: "about.mission.stat6.lab" },
                    ].map((s) => (
                      <div key={s.labKey} className="text-center p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                        <div className="text-lg font-semibold gradient-text">{t(s.valKey)}</div>
                        <div className="text-xs text-slate-500 mt-1">{t(s.labKey)}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">{t("about.values.title")}</h2>
                <div className="w-10 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mx-auto mt-3" />
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
              >
                {values.map((v) => (
                  <motion.div
                    key={v.titleKey}
                    variants={itemVariants}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-black/10"
                    data-testid={`card-value-${v.titleKey}`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mx-auto mb-4 shadow-md`}>
                      <v.icon className={`w-6 h-6 ${v.color}`} />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2 tracking-tight">{t(v.titleKey)}</h3>
                    <p className="text-sm text-slate-400 leading-[1.6]">{t(v.descKey)}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
