import { Link } from "wouter";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { ProductContactForm, type DemoProductId } from "@/components/product-contact-form";

const DEMO_CLOSE_MESSAGE = "webstudio-close-demo";

function BackToExamplesLink(props: React.ComponentPropsWithoutRef<"a">) {
  const { t } = useI18n();
  const inIframe = typeof window !== "undefined" && window.self !== window.top;
  const content = (
    <>
      <ArrowLeft className="w-4 h-4" />
      {t("demo.backToExamples")}
    </>
  );
  const className = "inline-flex items-center gap-1.5 " + (props.className ?? "");

  if (inIframe) {
    return (
      <a
        href="/"
        {...props}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          window.parent?.postMessage?.({ type: DEMO_CLOSE_MESSAGE }, "*");
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href="/" className={className}>
      {content}
    </Link>
  );
}

const PRODUCT_SUBJECT_KEYS: Record<DemoProductId, string> = {
  websites: "demo.form.subject.websites",
  landing: "demo.form.subject.landing",
  "digital-card": "demo.form.subject.digitalCard",
  marketing: "demo.form.subject.marketing",
};

export interface ProductExplanationPageProps {
  productId: DemoProductId;
  children?: React.ReactNode;
}

export function ProductExplanationPage({ productId, children }: ProductExplanationPageProps) {
  const { t } = useI18n();
  const prefix = productId === "digital-card" ? "product.card" : `product.${productId}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg text-slate-200">
            {t(`${prefix}.heroTitle`)}
          </span>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1.5"
              asChild
            >
              <BackToExamplesLink />
            </Button>
          </Link>
        </div>
      </header>

      <main id="main-content" className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 gradient-text">
            {t(`${prefix}.heroTitle`)}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t(`${prefix}.heroSubtitle`)}
          </p>
        </div>

        {children}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{t("product.sectionWhatIs")}</h2>
          <p className="text-foreground leading-relaxed">{t(`${prefix}.whatIs`)}</p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">{t(`${prefix}.forWhomTitle`)}</h2>
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-3 text-foreground">
                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t(`${prefix}.forWhom${i}`)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">{t(`${prefix}.includesTitle`)}</h2>
          <ul className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-3 text-foreground">
                <span className="w-2 h-2 rounded-full bg-neon-cyan shrink-0 mt-2" />
                <span>{t(`${prefix}.includes${i}`)}</span>
              </li>
            ))}
          </ul>
        </section>

        <ProductContactForm productId={productId} subjectKey={PRODUCT_SUBJECT_KEYS[productId]} />
      </main>
    </div>
  );
}
