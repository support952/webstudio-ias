import { motion } from "framer-motion";
import { Code2, BrainCircuit, Palette, Megaphone } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technologies. From blazing-fast landing pages to complex SaaS platforms.",
    gradient: "from-neon-purple to-blue-500",
    glowClass: "glow-purple",
  },
  {
    icon: BrainCircuit,
    title: "AI Automation",
    description: "Leverage artificial intelligence to automate workflows, enhance customer experiences, and unlock data-driven insights for your business.",
    gradient: "from-neon-cyan to-emerald-500",
    glowClass: "glow-cyan",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Beautiful, intuitive interfaces that delight users and drive conversions. We combine aesthetics with user research for impactful design.",
    gradient: "from-neon-pink to-rose-500",
    glowClass: "glow-pink",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Strategic campaigns that amplify your online presence. SEO, social media, PPC, and content marketing tailored to your goals.",
    gradient: "from-amber-400 to-orange-500",
    glowClass: "glow-purple",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function ServicesSection() {
  return (
    <section id="services" className="relative py-24 sm:py-32" data-testid="section-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-neon-cyan text-sm font-medium uppercase tracking-widest" data-testid="text-services-label">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-services-title">
            Our{" "}
            <span className="gradient-text">Services</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            We deliver end-to-end digital solutions that help businesses thrive in the modern landscape.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group glass-card rounded-md p-6 transition-all duration-300 gradient-border"
              data-testid={`card-service-${service.title.toLowerCase().replace(/[\s/]+/g, "-")}`}
            >
              <div className={`w-12 h-12 rounded-md bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 transition-shadow duration-300 group-hover:${service.glowClass}`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{service.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
