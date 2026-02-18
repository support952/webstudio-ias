import { motion } from "framer-motion";
import { Megaphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";

export function MarketingBanner() {
  const { t } = useI18n();

  return (
    <section className="py-8 sm:py-12 relative" data-testid="section-marketing-banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/marketing">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-visible rounded-md cursor-pointer group"
            data-testid="link-marketing-banner"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 via-neon-pink/15 to-neon-cyan/20 rounded-md" />
            <div className="absolute inset-0 ring-1 ring-white/[0.08] rounded-md group-hover:ring-white/[0.15] transition-all duration-300" />

            <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8">
              <div className="w-14 h-14 rounded-md bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center shrink-0">
                <Megaphone className="w-7 h-7 text-white" />
              </div>

              <div className="flex-1 text-center sm:text-start">
                <span className="text-neon-pink text-xs font-medium uppercase tracking-widest">
                  {t("marketing.banner.label")}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1" data-testid="text-marketing-banner-title">
                  {t("marketing.banner.title")}
                </h3>
                <p className="text-sm text-slate-400 mt-1 max-w-xl">
                  {t("marketing.banner.subtitle")}
                </p>
              </div>

              <Button
                className="bg-gradient-to-r from-neon-pink to-neon-purple text-white border-0 no-default-hover-elevate no-default-active-elevate shrink-0"
                data-testid="button-marketing-cta"
              >
                {t("marketing.banner.cta")}
                <ArrowRight className="w-4 h-4 ms-2" />
              </Button>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
