import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";

const projects = [
  {
    title: "NexGen Commerce Platform",
    category: "Full-Stack E-Commerce",
    description: "A high-performance e-commerce platform serving 50K+ daily users with AI-powered recommendations and real-time inventory management.",
    tech: ["React", "Node.js", "PostgreSQL", "Redis"],
    gradient: "from-neon-purple/20 to-blue-500/20",
    accent: "border-neon-purple/30",
  },
  {
    title: "QuantumAI Dashboard",
    category: "AI & Analytics",
    description: "An enterprise analytics dashboard with real-time data visualization, predictive modeling, and automated reporting for a Fortune 500 company.",
    tech: ["React", "Python", "TensorFlow", "AWS"],
    gradient: "from-neon-cyan/20 to-emerald-500/20",
    accent: "border-neon-cyan/30",
  },
  {
    title: "CloudBase Mobile App",
    category: "Cross-Platform Mobile",
    description: "A fintech mobile application enabling seamless peer-to-peer payments, cryptocurrency trading, and portfolio management.",
    tech: ["React Native", "Node.js", "MongoDB", "Stripe"],
    gradient: "from-neon-pink/20 to-rose-500/20",
    accent: "border-neon-pink/30",
  },
  {
    title: "DataFlow CRM Suite",
    category: "SaaS Platform",
    description: "A comprehensive CRM solution with workflow automation, email marketing integration, and advanced customer segmentation tools.",
    tech: ["Next.js", "GraphQL", "PostgreSQL", "SendGrid"],
    gradient: "from-amber-400/20 to-orange-500/20",
    accent: "border-amber-400/30",
  },
  {
    title: "InnovateLabs Website",
    category: "Corporate Branding",
    description: "A sleek corporate website with 3D animations, multilingual support, and a custom content management system for a biotech startup.",
    tech: ["React", "Three.js", "Sanity CMS", "Vercel"],
    gradient: "from-blue-400/20 to-indigo-500/20",
    accent: "border-blue-400/30",
  },
  {
    title: "TechCorp Automation Hub",
    category: "AI Automation",
    description: "An intelligent automation platform that reduced manual processes by 80% through custom AI agents and workflow orchestration.",
    tech: ["Python", "LangChain", "Docker", "GCP"],
    gradient: "from-emerald-400/20 to-teal-500/20",
    accent: "border-emerald-400/30",
  },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function Work() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <SEOHead title="Our Work" path="/work" />
      <div className="min-h-screen text-foreground font-sans antialiased">
        <Navbar />

        <main id="main-content">
          <section className="pt-safe-md pb-20 sm:pb-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-20"
              >
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-slate-500">
                  {t("work.label")}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.02em] text-white mt-3 mb-3" data-testid="text-work-title">
                  {t("work.title").split(" ")[0]}{" "}
                  <span className="gradient-text">{t("work.title").split(" ").slice(1).join(" ")}</span>
                </h1>
                <div className="w-10 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mx-auto mb-5" />
                <p className="text-slate-400 max-w-xl mx-auto text-base leading-[1.65]">
                  {t("work.subtitle")}
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.map((project, idx) => (
                  <motion.div
                    key={project.title}
                    variants={itemVariants}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden flex flex-col transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-xl hover:shadow-black/15"
                    data-testid={`card-project-${idx}`}
                  >
                    <div className={`h-36 bg-gradient-to-br ${project.gradient} flex items-center justify-center border-b border-white/[0.06]`}>
                      <div className="text-4xl font-bold text-white/10 select-none">0{idx + 1}</div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <span className="text-[11px] font-medium text-neon-cyan uppercase tracking-wider mb-2">{project.category}</span>
                      <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">{project.title}</h3>
                      <p className="text-sm text-slate-400 leading-[1.6] mb-4 flex-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tag) => (
                          <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-300 hover:text-neon-cyan p-0 h-auto w-fit text-sm font-medium transition-colors"
                      >
                        {t("work.viewProject")}
                        <ExternalLink className="w-3.5 h-3.5 ms-1.5 opacity-80" />
                      </Button>
                    </div>
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
