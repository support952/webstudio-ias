import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const projects = [
  {
    nameKey: "portfolio.p1.name",
    catKey: "portfolio.p1.cat",
    descKey: "portfolio.p1.desc",
    image: "/portfolio/ecommerce.svg",
    gradient: "from-neon-purple/60 to-neon-purple/20",
    accent: "bg-neon-purple/15 text-neon-purple",
  },
  {
    nameKey: "portfolio.p2.name",
    catKey: "portfolio.p2.cat",
    descKey: "portfolio.p2.desc",
    image: "/portfolio/saas.svg",
    gradient: "from-neon-cyan/60 to-neon-cyan/20",
    accent: "bg-neon-cyan/15 text-neon-cyan",
  },
  {
    nameKey: "portfolio.p3.name",
    catKey: "portfolio.p3.cat",
    descKey: "portfolio.p3.desc",
    image: "/portfolio/landing.svg",
    gradient: "from-neon-pink/60 to-neon-pink/20",
    accent: "bg-neon-pink/15 text-neon-pink",
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function PortfolioSection() {
  const { t } = useI18n();

  return (
    <section className="section-spacing relative bg-transparent" data-testid="section-portfolio">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-section-label font-medium tracking-[0.2em] uppercase text-foreground">
            {t("portfolio.label")}
          </span>
          <h2 className="text-section-title font-semibold tracking-tight text-foreground mt-3 mb-3">
            {t("portfolio.title")}
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            {t("portfolio.subtitle")}
          </p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <motion.div
              key={project.nameKey}
              variants={itemVariants}
              className="group rounded-2xl border border-border bg-card/80 overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-neon-cyan/5"
            >
              {/* Project image */}
              <div className={`aspect-video bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
                <img
                  src={project.image}
                  alt={t(project.nameKey)}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              {/* Card content */}
              <div className="p-5 text-start">
                {/* Category badge */}
                <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${project.accent} mb-3`}>
                  {t(project.catKey)}
                </span>

                {/* Project name (often Latin product names in all locales) */}
                <h3 className="text-foreground font-semibold text-base mb-2" dir="ltr">
                  {t(project.nameKey)}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {t(project.descKey)}
                </p>

                {/* View Case Study link */}
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-neon-cyan hover:text-neon-cyan/80 transition-colors group/link"
                >
                  {t("portfolio.viewCase")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 rtl:rotate-180 rtl:group-hover/link:-translate-x-0.5" aria-hidden />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
