import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$499",
    period: "per project",
    description: "Perfect for small businesses and personal projects",
    features: [
      "Single Page Website",
      "Responsive Design",
      "Basic SEO Setup",
      "Contact Form",
      "1 Month Support",
    ],
    popular: false,
    gradient: "",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$1,499",
    period: "per project",
    description: "Ideal for growing businesses that need more power",
    features: [
      "Multi-Page Website",
      "Custom UI/UX Design",
      "Advanced SEO",
      "CMS Integration",
      "Analytics Dashboard",
      "3 Months Support",
      "Performance Optimization",
    ],
    popular: true,
    gradient: "from-neon-purple via-neon-cyan to-neon-pink",
    buttonVariant: "default" as const,
  },
  {
    name: "Enterprise",
    price: "$3,999",
    period: "per project",
    description: "For large-scale digital transformation needs",
    features: [
      "Full-Stack Web Application",
      "AI/ML Integration",
      "Custom API Development",
      "Database Architecture",
      "DevOps & CI/CD",
      "12 Months Support",
      "Dedicated Project Manager",
      "Priority Support",
    ],
    popular: false,
    gradient: "",
    buttonVariant: "outline" as const,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32" data-testid="section-pricing">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-pricing-title">
            Choose Your{" "}
            <span className="gradient-text">Plan</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Transparent pricing with no hidden fees. Pick the package that fits your vision.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`relative glass-card rounded-md p-6 sm:p-8 flex flex-col transition-all duration-300 ${
                plan.popular ? "md:-mt-4 md:mb-[-16px] ring-1 ring-neon-purple/30" : ""
              }`}
              data-testid={`card-pricing-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-neon-purple to-neon-cyan text-white">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1" data-testid={`text-plan-name-${plan.name.toLowerCase()}`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white" data-testid={`text-plan-price-${plan.name.toLowerCase()}`}>
                  {plan.price}
                </span>
                <span className="text-slate-500 ml-2 text-sm">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-neon-cyan" : "text-slate-500"}`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <a href="#contact">
                {plan.popular ? (
                  <Button
                    className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
                    data-testid={`button-plan-${plan.name.toLowerCase()}`}
                  >
                    Get Started
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 no-default-hover-elevate no-default-active-elevate bg-transparent"
                    data-testid={`button-plan-${plan.name.toLowerCase()}`}
                  >
                    Get Started
                  </Button>
                )}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
