import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

function AnimatedOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-neon-purple/20 blur-[120px] animate-orb-1" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-neon-cyan/15 blur-[100px] animate-orb-2" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-neon-pink/10 blur-[80px] animate-orb-3" />

      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20" data-testid="section-hero">
      <AnimatedOrbs />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase glass-card text-neon-cyan mb-8" data-testid="badge-hero-tag">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
              Next-Gen Digital Agency
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
            data-testid="text-hero-title"
          >
            Transforming Visions{" "}
            <br className="hidden sm:block" />
            into{" "}
            <span className="gradient-text">
              Digital Reality
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            data-testid="text-hero-subtitle"
          >
            We craft cutting-edge digital experiences that elevate your brand,
            drive growth, and push the boundaries of what's possible on the web.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#services">
              <Button
                size="lg"
                className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate px-8"
                data-testid="button-view-work"
              >
                View Our Work
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#contact">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 text-slate-300 no-default-hover-elevate no-default-active-elevate px-8 bg-transparent"
                data-testid="button-contact-hero"
              >
                <Play className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 sm:mt-20 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
            data-testid="stats-hero"
          >
            {[
              { value: "150+", label: "Projects Delivered" },
              { value: "50+", label: "Happy Clients" },
              { value: "99%", label: "Satisfaction Rate" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold gradient-text" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
