import { Mail, Phone, Linkedin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ProductExplanationPage } from "@/components/product-explanation-page";
import { SEOHead } from "@/components/seo-head";

function CardPreview() {
  const { t } = useI18n();
  return (
    <div className="flex justify-center mb-12">
      <div className="w-full max-w-xs rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl">
        <div className="aspect-[3/4] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute bottom-0 left-0 right-0 p-5 pt-12 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-white/40 overflow-hidden mx-auto mb-3 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white font-semibold text-lg">Alex Chen</p>
            <p className="text-cyan-300/90 text-sm">Product Designer</p>
            <p className="text-slate-500 text-xs mt-1">WebStudio</p>
            <div className="flex justify-center gap-2 mt-4">
              <a href="https://mail.google.com/mail/?view=cm&to=alex%40example.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" aria-label="Email">
                <Mail className="w-4 h-4 text-white" />
              </a>
              <a href="tel:+1234567890" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" aria-label="Phone">
                <Phone className="w-4 h-4 text-white" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-500 text-xs py-3 border-t border-white/10">
          {t("demo.card.previewNote")}
        </p>
      </div>
    </div>
  );
}

export default function DemoDigitalCard() {
  return (
    <>
      <SEOHead title="Digital Card Demo" path="/demos/digital-card" />
      <ProductExplanationPage productId="digital-card">
        <CardPreview />
      </ProductExplanationPage>
    </>
  );
}
