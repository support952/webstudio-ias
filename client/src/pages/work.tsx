import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
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
              <span className="text-neon-pink text-sm font-medium uppercase tracking-widest">
                {t("work.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-work-title">
                {t("work.title").split(" ")[0]}{" "}
                <span className="gradient-text">{t("work.title").split(" ").slice(1).join(" ")}</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
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
                  className={`glass-card rounded-md overflow-visible gradient-border flex flex-col`}
                  data-testid={`card-project-${idx}`}
                >
                  <div className={`h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center rounded-t-md`}>
                    <div className="text-4xl font-bold text-white/10 select-none">
                      0{idx + 1}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs text-neon-cyan uppercase tracking-wider mb-2">{project.category}</span>
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neon-cyan p-0 h-auto w-fit"
                    >
                      {t("work.viewProject")}
                      <ExternalLink className="w-3 h-3 ms-1" />
                    </Button>
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
