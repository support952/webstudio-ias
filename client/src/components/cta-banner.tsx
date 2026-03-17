import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  const { t } = useI18n();

  return (
    <section className="relative bg-transparent" aria-label="Call to action">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-1">
              {t("ctaBanner.title")}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {t("ctaBanner.subtitle")}
            </p>
          </div>
          <Link href="/contact" className="shrink-0">
            <Button className="bg-gradient-to-r from-neon-purple to-neon-cyan text-primary-foreground border-0 gap-2">
              {t("ctaBanner.button")}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
