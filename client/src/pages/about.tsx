import { motion } from "framer-motion";
import { Lightbulb, HeartHandshake, Award, Eye } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { useI18n } from "@/lib/i18n";

const values = [
  { icon: Lightbulb, titleKey: "about.values.v1.title", descKey: "about.values.v1.desc", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
  { icon: HeartHandshake, titleKey: "about.values.v2.title", descKey: "about.values.v2.desc", color: "text-neon-purple", bg: "bg-neon-purple/10" },
  { icon: Award, titleKey: "about.values.v3.title", descKey: "about.values.v3.desc", color: "text-neon-pink", bg: "bg-neon-pink/10" },
  { icon: Eye, titleKey: "about.values.v4.title", descKey: "about.values.v4.desc", color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Co-Founder", initials: "SC" },
  { name: "Marcus Williams", role: "CTO", initials: "MW" },
  { name: "Elena Rodriguez", role: "Head of Design", initials: "ER" },
  { name: "David Kim", role: "VP Engineering", initials: "DK" },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function About() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-neon-purple text-sm font-medium uppercase tracking-widest">
                {t("about.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-about-title">
                {t("about.title").split(" ")[0]}{" "}
                <span className="gradient-text">{t("about.title").split(" ").slice(1).join(" ")}</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
                {t("about.subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card rounded-md p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-white mb-4">{t("about.story.title")}</h2>
                <p className="text-slate-400 leading-relaxed mb-4">{t("about.story.p1")}</p>
                <p className="text-slate-400 leading-relaxed">{t("about.story.p2")}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card rounded-md p-6 sm:p-8 flex flex-col justify-center"
              >
                <h2 className="text-xl font-bold text-white mb-4">{t("about.mission.title")}</h2>
                <p className="text-slate-400 leading-relaxed">{t("about.mission.text")}</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    { val: "30+", lab: "Team Members" },
                    { val: "6+", lab: "Years Experience" },
                    { val: "12", lab: "Countries Served" },
                    { val: "98%", lab: "Client Retention" },
                  ].map((s) => (
                    <div key={s.lab} className="text-center p-3 rounded-md bg-white/[0.02]">
                      <div className="text-xl font-bold gradient-text">{s.val}</div>
                      <div className="text-xs text-slate-500 mt-1">{s.lab}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold">{t("about.values.title")}</h2>
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
                  className="glass-card rounded-md p-6 text-center gradient-border"
                  data-testid={`card-value-${v.titleKey}`}
                >
                  <div className={`w-12 h-12 rounded-md ${v.bg} flex items-center justify-center mx-auto mb-4`}>
                    <v.icon className={`w-6 h-6 ${v.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{t(v.titleKey)}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{t(v.descKey)}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold">{t("about.team.title")}</h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  variants={itemVariants}
                  className="glass-card rounded-md p-6 text-center gradient-border"
                  data-testid={`card-team-${member.initials.toLowerCase()}`}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                    {member.initials}
                  </div>
                  <h3 className="text-sm font-semibold text-white">{member.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{member.role}</p>
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
