import { motion } from "framer-motion";
import { Globe, Megaphone, CreditCard, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";
import { TiltCard } from "@/components/tilt-card";

const products = [
  {
    id: "websites",
    icon: Globe,
    titleKey: "products.websites",
    descKey: "products.websitesDesc",
    href: "/preview/websites",
    ctaHref: "/contact?service=Ecommerce",
    gradient: "from-neon-purple to-blue-500",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
  },
  {
    id: "marketing",
    icon: Megaphone,
    titleKey: "products.marketing",
    descKey: "products.marketingDesc",
    href: "/preview/marketing",
    ctaHref: "/contact?service=Branding",
    gradient: "from-neon-pink to-neon-purple",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop",
  },
  {
    id: "card",
    icon: CreditCard,
    titleKey: "products.card",
    descKey: "products.cardDesc",
    href: "/preview/digital-card",
    ctaHref: "/contact?service=DigitalCards",
    gradient: "from-neon-pink to-rose-500",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
  },
  {
    id: "landing",
    icon: FileText,
    titleKey: "products.landing",
    descKey: "products.landingDesc",
    href: "/preview/landing",
    ctaHref: "/contact?service=LandingPage",
    gradient: "from-neon-cyan to-emerald-500",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop",
  },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const itemVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Products() {
  const { t } = useI18n();

  return (
    <PageWrapper>
      <SEOHead title="Products" path="/products" />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <main id="main-content" className="pt-32 pb-16 sm:pt-40 sm:pb-20 relative">
          <div className="absolute top-20 end-0 w-[400px] h-[400px] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 start-0 w-[500px] h-[500px] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <span className="text-neon-cyan text-sm font-medium uppercase tracking-widest">
                {t("products.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-products-title">
                <span className="gradient-text">{t("products.title")}</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
                {t("products.subtitle")}
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                >
                <TiltCard className="h-full" maxTilt={8}>
                <div
                  className="group rounded-2xl overflow-hidden border border-border bg-card/80 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 h-full"
                  data-testid={`card-product-${product.id}`}
                >
                  <Link href={product.href} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={t(product.titleKey)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-lg`}
                        >
                          <product.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-semibold text-lg drop-shadow-lg">
                          {t(product.titleKey)}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="p-5 sm:p-6 border-t border-border">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {t(product.descKey)}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href={product.href}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/40 text-primary hover:bg-primary/10"
                        >
                          {t("products.cta")}
                          <ArrowRight className="w-3.5 h-3.5 ms-1.5" />
                        </Button>
                      </Link>
                      <Link href={product.ctaHref}>
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          {t("hero.cta2")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
