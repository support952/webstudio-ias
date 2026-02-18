import { motion } from "framer-motion";
import { Zap, Shield, Lightbulb, Clock, HeartHandshake, Rocket } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Lightning Speed",
    description: "Optimized performance with sub-second load times. We build websites that are as fast as they are beautiful.",
    color: "text-neon-cyan",
    bg: "bg-neon-cyan/10",
  },
  {
    icon: Shield,
    title: "Rock-Solid Security",
    description: "Enterprise-grade security practices built into every layer. Your data and your users are always protected.",
    color: "text-neon-purple",
    bg: "bg-neon-purple/10",
  },
  {
    icon: Lightbulb,
    title: "Innovative Solutions",
    description: "We stay ahead of the curve with cutting-edge technologies and creative problem-solving approaches.",
    color: "text-neon-pink",
    bg: "bg-neon-pink/10",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "We respect your timelines. Every project is meticulously planned and delivered on schedule, every time.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
  {
    icon: HeartHandshake,
    title: "Dedicated Support",
    description: "Your success is our priority. We provide ongoing maintenance and support long after launch.",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    icon: Rocket,
    title: "Scalable Architecture",
    description: "Build for today, scale for tomorrow. Our solutions grow seamlessly with your business needs.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function WhyUsSection() {
  return (
    <section id="why-us" className="relative py-24 sm:py-32" data-testid="section-why-us">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-neon-purple text-sm font-medium uppercase tracking-widest" data-testid="text-why-us-label">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-why-us-title">
            Built for{" "}
            <span className="gradient-text">Excellence</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            We combine technical expertise with creative vision to deliver results that exceed expectations.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={itemVariants}
              className="group flex items-start gap-4 p-5 rounded-md glass-card transition-all duration-300 gradient-border"
              data-testid={`card-reason-${reason.title.toLowerCase().replace(/[\s-]+/g, "-")}`}
            >
              <div className={`shrink-0 w-11 h-11 rounded-md ${reason.bg} flex items-center justify-center`}>
                <reason.icon className={`w-5 h-5 ${reason.color}`} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-1">{reason.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
