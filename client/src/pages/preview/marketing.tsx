import { useI18n } from "@/lib/i18n";
import { BarChart3, Target, Megaphone, ArrowRight } from "lucide-react";
import { SEOHead } from "@/components/seo-head";

export default function PreviewMarketing() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-violet-950/20 to-slate-950 text-white">
      <SEOHead title="Marketing Preview" path="/preview/marketing" />
      {typeof window !== "undefined" && window.self !== window.top && (
        <div className="fixed top-0 left-0 right-0 z-50 h-9 bg-black/60 backdrop-blur-sm border-b border-white/5 flex items-center justify-end px-4">
          <button
            type="button"
            onClick={() => window.parent?.postMessage?.({ type: "webstudio-close-demo" }, "*")}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {t("demo.backToExamples")}
          </button>
        </div>
      )}

      <section className="relative pt-20 pb-16 px-4 sm:pt-28 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-violet-500/10 to-pink-500/15" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(139,92,246,0.25),transparent)]" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-sm font-medium mb-8">
            {t("demo.marketing.brand")}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              {t("demo.marketing.heroTitle")}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("demo.marketing.heroSubtitle")}
          </p>
          <a
            href="#channels"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-200"
          >
            See what we offer
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Image strip */}
      <section className="py-12 px-4 border-y border-white/10 bg-slate-900/40">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground text-center text-sm font-medium mb-8">Campaigns we run</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop",
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
              "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop",
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
            ].map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border-2 border-purple-500/20 aspect-video hover:border-pink-500/40 transition-colors">
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="channels" className="py-20 px-4 border-t border-white/10 bg-gradient-to-b from-purple-500/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-white">
            {t("demo.marketing.channelsTitle")}
          </h2>
          <p className="text-slate-500 text-center mb-14 max-w-xl mx-auto">Full-funnel campaigns that drive results.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-gradient-to-br from-blue-500/25 to-slate-800/90 border-2 border-blue-500/40 p-8 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/40 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20">
                <Megaphone className="w-7 h-7 text-blue-200" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{t("demo.marketing.meta.title")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t("demo.marketing.meta.desc")}</p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-pink-500/25 to-slate-800/90 border-2 border-pink-500/40 p-8 hover:border-pink-400/60 hover:shadow-xl hover:shadow-pink-500/10 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/40 flex items-center justify-center mb-5 shadow-lg shadow-pink-500/20">
                <Target className="w-7 h-7 text-pink-200" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{t("demo.marketing.targeting.title")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t("demo.marketing.targeting.desc")}</p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-cyan-500/25 to-slate-800/90 border-2 border-cyan-500/40 p-8 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/10 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/40 flex items-center justify-center mb-5 shadow-lg shadow-cyan-500/20">
                <BarChart3 className="w-7 h-7 text-cyan-200" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{t("demo.marketing.analytics.title")}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{t("demo.marketing.analytics.desc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-white/10 bg-slate-900/30">
        <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-br from-purple-500/15 to-slate-800/80 border-2 border-purple-500/30 p-8 sm:p-10">
          <h3 className="font-bold text-white text-xl mb-3">{t("demo.marketing.meta.heading")}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{t("demo.marketing.meta.body")}</p>
          <ul className="space-y-3 text-slate-300 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-purple-400 mt-0.5">✓</span>
              {t("demo.marketing.meta.bullet1")}
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-400 mt-0.5">✓</span>
              {t("demo.marketing.meta.bullet2")}
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-0.5">✓</span>
              {t("demo.marketing.meta.bullet3")}
            </li>
          </ul>
        </div>
      </section>

      {/* Results strip */}
      <section className="py-16 px-4 border-y border-white/10 bg-gradient-to-r from-purple-500/10 via-slate-900 to-pink-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Results that speak</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="rounded-2xl py-6 px-4 bg-purple-500/15 border border-purple-500/30">
              <p className="text-3xl font-bold text-purple-300">+240%</p>
              <p className="text-slate-500 text-sm mt-1">ROAS</p>
            </div>
            <div className="rounded-2xl py-6 px-4 bg-pink-500/15 border border-pink-500/30">
              <p className="text-3xl font-bold text-pink-300">50k+</p>
              <p className="text-slate-500 text-sm mt-1">Leads</p>
            </div>
            <div className="rounded-2xl py-6 px-4 bg-cyan-500/15 border border-cyan-500/30">
              <p className="text-3xl font-bold text-cyan-300">24/7</p>
              <p className="text-slate-500 text-sm mt-1">Optimization</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
