import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Globe, FileText, CreditCard, Megaphone, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { BrowserSimulator } from "@/components/browser-simulator";
import { DigitalCardPreviewModal } from "@/components/digital-card-preview-modal";
import { TiltCard } from "@/components/tilt-card";
import { useState } from "react";

const productToServiceParam: Record<string, string> = {
  websites: "Ecommerce",
  landing: "LandingPage",
  card: "DigitalCards",
  marketing: "Branding",
};

const examples = [
  {
    id: "websites",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
    icon: Globe,
    titleKey: "examples.websites.title",
    descKey: "examples.websites.desc",
    href: "/preview/websites",
    gradient: "from-neon-purple to-blue-500",
  },
  {
    id: "landing",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop",
    icon: FileText,
    titleKey: "examples.landing.title",
    descKey: "examples.landing.desc",
    href: "/preview/landing",
    gradient: "from-neon-cyan to-emerald-500",
  },
  {
    id: "card",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
    icon: CreditCard,
    titleKey: "examples.card.title",
    descKey: "examples.card.desc",
    href: "/preview/digital-card",
    gradient: "from-neon-pink to-rose-500",
  },
  {
    id: "marketing",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop",
    icon: Megaphone,
    titleKey: "marketing.banner.title",
    descKey: "marketing.banner.subtitle",
    href: "/preview/marketing",
    gradient: "from-neon-pink to-neon-purple",
  },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

export function ExamplesShowcase() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [openDemo, setOpenDemo] = useState<string | null>(null);
  const [digitalCardModalOpen, setDigitalCardModalOpen] = useState(false);

  return (
    <section className="section-spacing relative overflow-hidden bg-transparent" data-testid="section-examples">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="text-section-label font-medium tracking-[0.2em] uppercase text-primary">
            {t("examples.label")}
          </span>
          <h2 className="text-section-title font-bold tracking-tight text-foreground mt-3 mb-3">
            {t("examples.title").split(" ").slice(0, -1).join(" ")}{" "}
            <span className="gradient-text">{t("examples.title").split(" ").slice(-1)[0]}</span>
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent mx-auto mb-5" />
          <p className="text-section-subtitle text-muted-foreground max-w-xl mx-auto">
            {t("examples.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch"
        >
          {examples.map((item) => (
            <motion.div key={item.id} variants={itemVariants} className="flex min-h-0">
              <TiltCard className="flex flex-col w-full h-full min-h-0 rounded-2xl overflow-hidden card-futuristic transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] cursor-pointer" maxTilt={6}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (item.id === "card") setDigitalCardModalOpen(true);
                    else if (item.id === "marketing") {
                      setLocation(`/contact?service=${productToServiceParam.marketing}`);
                      return;
                    } else setOpenDemo(item.href);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    if (item.id === "card") setDigitalCardModalOpen(true);
                    else if (item.id === "marketing") {
                      setLocation(`/contact?service=${productToServiceParam.marketing}`);
                      return;
                    } else setOpenDemo(item.href);
                  }}
                  className="group flex flex-col w-full h-full min-h-0"
                >
                {/* Fixed aspect ratio image container */}
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={t(item.titleKey)}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_24px_rgba(139,92,246,0.4)] transition-shadow duration-300`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-base leading-snug drop-shadow-lg line-clamp-2">
                      {t(item.titleKey)}
                    </span>
                  </div>
                </div>
                {/* Content area: flex-1 + min-h-0 so CTAs align at bottom */}
                <div className="flex flex-1 flex-col min-h-0 p-5 sm:p-6 border-t border-border">
                  <p className="text-muted-foreground text-sm leading-[1.6] line-clamp-3 mb-3">
                    {t(item.descKey)}
                  </p>
                  <div className="mt-auto pt-0 flex flex-col">
                    <p className="text-[11px] font-medium tracking-wider uppercase text-primary/90 mb-3">
                      {item.id === "marketing" ? t("marketing.details.cta") : t("examples.clickForPreview")}
                    </p>
                    <Link
                      href={`/contact?service=${productToServiceParam[item.id] ?? productToServiceParam.websites}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center min-h-[48px] w-fit text-muted-foreground hover:text-primary text-sm font-medium transition-all duration-200 hover:translate-x-0.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background pr-1 -ml-1 py-2"
                      aria-label={t("examples.cta")}
                    >
                      {t("examples.cta")}
                      <ArrowRight className="w-3.5 h-3.5 ms-1.5 shrink-0" aria-hidden />
                    </Link>
                  </div>
                </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {openDemo && (
          <BrowserSimulator
            open={!!openDemo}
            onClose={() => setOpenDemo(null)}
            url={openDemo}
            title={examples.find((e) => e.href === openDemo) ? t(examples.find((e) => e.href === openDemo)!.titleKey) : undefined}
          />
        )}
        <DigitalCardPreviewModal open={digitalCardModalOpen} onClose={() => setDigitalCardModalOpen(false)} />
      </div>
    </section>
  );
}
