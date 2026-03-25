import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

export function PreviewPageControls() {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const isEmbedded = typeof window !== "undefined" && window.self !== window.top;

  return (
    <div
      className={`fixed end-4 z-[65] flex items-center gap-2 ${
        isEmbedded ? "top-12" : "top-4"
      }`}
    >
      <Link href="/products" aria-label={t("demo.backToProducts")}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="bg-background/90 text-foreground border-border backdrop-blur"
        >
          <ArrowLeft className="w-4 h-4 me-1.5 rtl:rotate-180" aria-hidden />
          {t("demo.backToProducts")}
        </Button>
      </Link>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="bg-background/90 text-foreground border-border backdrop-blur"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? t("nav.switchToLight") : t("nav.switchToDark")}
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>
    </div>
  );
}
