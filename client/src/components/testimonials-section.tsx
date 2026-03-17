import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { TiltCard } from "@/components/tilt-card";

const testimonials = [
  {
    quote: "WebStudio delivered our new platform ahead of schedule. The team's technical expertise and clear communication made the entire process smooth.",
    name: "Sarah Chen",
    role: "CTO",
    company: "TechCorp",
    rating: 5,
  },
  {
    quote: "From concept to launch, the attention to detail and creative solutions exceeded our expectations. Our conversion rate increased by 40%.",
    name: "Marcus Webb",
    role: "Head of Digital",
    company: "InnovateLabs",
    rating: 5,
  },
  {
    quote: "Professional, responsive, and results-driven. We've partnered with WebStudio for multiple projects and will continue to do so.",
    name: "Elena Rodriguez",
    role: "Marketing Director",
    company: "CloudBase",
    rating: 5,
  },
];

/** Deterministic gradient from name hash */
const GRADIENTS = [
  "from-neon-purple to-neon-cyan",
  "from-neon-pink to-neon-purple",
  "from-neon-cyan to-emerald-500",
  "from-amber-400 to-orange-500",
  "from-rose-500 to-pink-500",
];

function nameToGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const itemVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export function TestimonialsSection() {
  const { t } = useI18n();

  return (
    <section className="section-spacing relative overflow-hidden bg-transparent" data-testid="section-testimonials">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-section-label font-medium tracking-[0.2em] uppercase text-foreground">
            {t("testimonials.label")}
          </span>
          <h2 className="text-section-title font-semibold tracking-tight text-foreground mt-3 mb-3">
            {t("testimonials.title")}
          </h2>
          <p className="text-section-subtitle text-foreground/90 max-w-xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {testimonials.map((tst) => (
            <motion.div key={tst.name} variants={itemVariants}>
              <TiltCard className="h-full" maxTilt={5}>
                <div className="glass-card rounded-2xl p-6 sm:p-8 hover:border-primary/30 transition-colors flex flex-col h-full">
                  <Quote className="w-10 h-10 text-primary/60 mb-4" aria-hidden />
                  <div className="flex gap-1 mb-4" aria-label={`${tst.rating} out of 5 stars`}>
                    {[...Array(tst.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" aria-hidden />
                    ))}
                  </div>
                  <blockquote className="text-foreground text-base leading-relaxed flex-1 mb-6">
                    &ldquo;{tst.quote}&rdquo;
                  </blockquote>
                  <footer className="pt-4 border-t border-border flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${nameToGradient(tst.name)} flex items-center justify-center shrink-0`}>
                      <span className="text-sm font-bold text-white leading-none">{getInitials(tst.name)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground flex items-center gap-1.5">
                        {tst.name}
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" aria-label="Verified" />
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {tst.role}, {tst.company}
                      </p>
                    </div>
                  </footer>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
