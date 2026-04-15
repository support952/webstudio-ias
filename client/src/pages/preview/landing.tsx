import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Zap, Shield, Headphones, Quote, Mail } from "lucide-react";
import { SEOHead } from "@/components/seo-head";
import { PreviewPageControls } from "@/components/preview-page-controls";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/lib/theme";

export default function PreviewLanding() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [ctaSuccess, setCtaSuccess] = useState(false);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtaSuccess(true);
    setTimeout(() => setCtaSuccess(false), 4000);
  };

  return (
    <div
      dir="ltr"
      lang="en"
      className={`preview-page ${theme === "light" ? "preview-light bg-background text-foreground" : "preview-dark bg-slate-950 text-white"} min-h-screen overflow-x-hidden font-sans antialiased`}
    >
      <SEOHead title="Landing Preview" path="/preview/landing" />
      <PreviewPageControls />
      {ctaSuccess && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-medium shadow-xl shadow-emerald-500/20 backdrop-blur-sm">
          Thank you for your interest! We'll be in touch soon.
        </div>
      )}
      {/* Back bar */}
      {typeof window !== "undefined" && window.self !== window.top && (
        <div className={`fixed top-0 inset-x-0 z-50 h-9 backdrop-blur-md border-b flex items-center justify-end px-4 ${
          isLight ? "bg-white/80 border-slate-200" : "bg-slate-950/80 border-white/5"
        }`}>
          <button
            type="button"
            onClick={() => window.parent?.postMessage?.({ type: "webstudio-close-demo" }, "*")}
            className={`text-xs transition-colors ${isLight ? "text-slate-600 hover:text-cyan-700" : "text-slate-400 hover:text-cyan-400"}`}
          >
            {t("demo.backToExamples")}
          </button>
        </div>
      )}

      {/* Hero */}
      <section className="relative pt-safe-md pb-0 px-4 overflow-hidden">
        <div className={`absolute inset-0 ${isLight ? "bg-gradient-to-b from-white via-slate-100/70 to-white" : "bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950"}`} />
        <div className={`absolute inset-0 ${isLight ? "bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(6,182,212,0.1),transparent_55%)]" : "bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(6,182,212,0.2),transparent_50%)]"}`} />
        <div className={`absolute inset-0 ${isLight ? "bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(139,92,246,0.06),transparent)]" : "bg-[radial-gradient(ellipse_60%_50%_at_80%_50%,rgba(139,92,246,0.12),transparent)]"}`} />
        <div className={`absolute inset-0 ${isLight ? "bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(244,63,94,0.04),transparent)]" : "bg-[radial-gradient(ellipse_50%_40%_at_20%_80%,rgba(244,63,94,0.08),transparent)]"}`} />
        <div className="relative max-w-4xl mx-auto text-center pb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium mb-10 shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
            {t("demo.landing.badge")}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
              {t("demo.landing.heroTitle")}
            </span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("demo.landing.heroSubtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              type="button"
              onClick={handleCtaClick}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-300 border border-cyan-400/20"
            >
              {t("demo.landing.ctaStart")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180" aria-hidden />
            </button>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
            >
              {t("demo.landing.ctaLearn")}
            </a>
          </div>
        </div>
        {/* Hero image */}
        <div className="relative max-w-6xl mx-auto px-4 pb-20">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 ring-1 ring-white/5">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop"
              alt=""
              loading="lazy"
              className="w-full h-auto aspect-[2/1] object-cover"
            />
            <div className={`absolute inset-0 pointer-events-none ${isLight ? "bg-gradient-to-t from-white/20 via-transparent to-transparent" : "bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"}`} />
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </section>

      {/* Stats */}
      <section className="relative py-16 px-4">
        <div className={isLight ? "absolute inset-0 bg-white/20" : "absolute inset-0 bg-slate-900/50"} />
        <div className="relative max-w-4xl mx-auto grid grid-cols-3 gap-6 sm:gap-8">
          <div className="rounded-2xl py-8 px-6 bg-gradient-to-b from-cyan-500/15 to-cyan-500/5 border border-cyan-500/20 shadow-xl shadow-cyan-500/5 hover:shadow-cyan-500/10 transition-shadow duration-300">
            <p className="text-3xl sm:text-4xl font-bold text-cyan-400">{t("demo.landing.stats1")}</p>
            <p className="text-slate-400 text-sm font-medium mt-2">{t("demo.landing.stats1Label")}</p>
          </div>
          <div className="rounded-2xl py-8 px-6 bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 border border-emerald-500/20 shadow-xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-shadow duration-300">
            <p className="text-3xl sm:text-4xl font-bold text-emerald-400">{t("demo.landing.stats2")}</p>
            <p className="text-slate-400 text-sm font-medium mt-2">{t("demo.landing.stats2Label")}</p>
          </div>
          <div className="rounded-2xl py-8 px-6 bg-gradient-to-b from-amber-500/15 to-amber-500/5 border border-amber-500/20 shadow-xl shadow-amber-500/5 hover:shadow-amber-500/10 transition-shadow duration-300">
            <p className="text-3xl sm:text-4xl font-bold text-amber-400">{t("demo.landing.stats3")}</p>
            <p className="text-slate-400 text-sm font-medium mt-2">{t("demo.landing.stats3Label")}</p>
          </div>
        </div>
      </section>

      {/* Image strip — Image gallery */}
      <section className="py-20 px-4 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-slate-500 text-center text-sm font-medium mb-12 tracking-wide uppercase">See what we've built</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=320&fit=crop",
              "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=320&fit=crop",
              "https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=320&fit=crop",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=320&fit=crop",
              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=320&fit=crop",
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=320&fit=crop",
              "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=320&fit=crop",
              "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=320&fit=crop",
            ].map((src, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] shadow-xl group">
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width banner image */}
      <section className="py-0">
        <div className="relative w-full aspect-[21/9] max-h-[420px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1400&h=600&fit=crop"
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className={isLight ? "absolute inset-0 bg-white/8" : "absolute inset-0 bg-slate-950/50"} />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/90 text-lg sm:text-xl font-medium tracking-wide">Built for growth</p>
          </div>
        </div>
      </section>

      {/* Gallery — Premium image grid */}
      <section className="py-24 px-4 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">In action</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent mx-auto mb-4" />
            <p className="text-slate-500 max-w-xl mx-auto">Real projects, real impact.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/10 shadow-xl group col-span-2 row-span-2">
              <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=1000&fit=crop" alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-xl group">
              <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop" alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-xl group">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop" alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-xl group">
              <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop" alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-xl group">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Features — with images */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {t("demo.landing.featuresTitle")}
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto mb-4" />
            <p className="text-slate-500 max-w-xl mx-auto">Everything you need to launch and grow.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { Icon: Zap, iconClass: "bg-cyan-500/20", textClass: "text-cyan-400", titleKey: "demo.landing.f1", descKey: "demo.landing.f1desc", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=240&fit=crop" },
              { Icon: Shield, iconClass: "bg-emerald-500/20", textClass: "text-emerald-400", titleKey: "demo.landing.f2", descKey: "demo.landing.f2desc", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop" },
              { Icon: Headphones, iconClass: "bg-amber-500/20", textClass: "text-amber-400", titleKey: "demo.landing.f3", descKey: "demo.landing.f3desc", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=240&fit=crop" },
            ].map(({ Icon, iconClass, textClass, titleKey, descKey, img }) => (
              <div
                key={titleKey}
                className="group rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-cyan-500/20 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
                  <div className={`absolute bottom-3 left-3 w-12 h-12 rounded-xl ${iconClass} flex items-center justify-center shadow-lg`}>
                    <Icon className={`w-6 h-6 ${textClass}`} />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-white text-lg mb-2">{t(titleKey)}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t(descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — with images */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/50" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t("demo.landing.howTitle")}</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent mx-auto" />
          </div>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              { num: "01", titleKey: "demo.landing.step1", desc: "Create your account and tell us your goals.", circleClass: "bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=280&fit=crop" },
              { num: "02", titleKey: "demo.landing.step2", desc: "Our team designs and builds your solution.", circleClass: "bg-violet-500/20 border-violet-500/40 text-violet-400 shadow-lg shadow-violet-500/10", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=280&fit=crop" },
              { num: "03", titleKey: "demo.landing.step3", desc: "Go live and scale with our support.", circleClass: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=280&fit=crop" },
            ].map(({ num, titleKey, desc, circleClass, img }) => (
              <div key={num} className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-slate-800/30 hover:border-violet-500/20 transition-colors">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-4 start-4 w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold bg-slate-900/80 backdrop-blur-sm text-white">{num}</div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-white mb-2">{t(titleKey)}</h3>
                  <p className="text-slate-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t("demo.landing.pricingTitle")}</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto mb-4" />
            <p className="text-slate-500">{t("demo.landing.pricingSubtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { nameKey: "demo.landing.plan1Name", descKey: "demo.landing.plan1Desc", price: "$29", featureKeys: ["demo.landing.plan1F1", "demo.landing.plan1F2", "demo.landing.plan1F3", "demo.landing.plan1F4"], border: "border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-transparent shadow-xl shadow-emerald-500/5" },
              { nameKey: "demo.landing.plan2Name", descKey: "demo.landing.plan2Desc", price: "$79", featureKeys: ["demo.landing.plan2F1", "demo.landing.plan2F2", "demo.landing.plan2F3", "demo.landing.plan2F4"], border: "border-cyan-500/40 bg-gradient-to-b from-cyan-500/15 to-transparent shadow-2xl shadow-cyan-500/10 ring-2 ring-cyan-500/20", highlight: true },
              { nameKey: "demo.landing.plan3Name", descKey: "demo.landing.plan3Desc", price: "$199", featureKeys: ["demo.landing.plan3F1", "demo.landing.plan3F2", "demo.landing.plan3F3", "demo.landing.plan3F4"], border: "border-violet-500/30 bg-gradient-to-b from-violet-500/10 to-transparent shadow-xl shadow-violet-500/5" },
            ].map((plan) => (
              <div key={plan.nameKey} className={`rounded-3xl border-2 p-8 ${plan.border} hover:shadow-xl transition-shadow duration-300`}>
                <h3 className="font-bold text-white text-xl mb-1">{t(plan.nameKey)}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{t(plan.descKey)}</p>
                <p className="text-3xl font-bold text-white mb-6">{plan.price}<span className="text-slate-500 text-base font-normal">/mo</span></p>
                <ul className="space-y-3 mb-8">
                  {plan.featureKeys.map((key) => (
                    <li key={key} className="flex items-center gap-2 text-slate-300 text-sm">
                      <span className="text-cyan-400">✓</span> {t(key)}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={handleCtaClick} className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${plan.highlight ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02]" : "bg-white/10 text-white hover:bg-white/15"}`}>
                  {t("demo.landing.getStarted")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase — Large images */}
      <section className="py-24 px-4 border-t border-white/5 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Real results</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto mb-4" />
            <p className="text-slate-500 max-w-xl mx-auto">Projects we've delivered for teams like yours.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&h=460&fit=crop", label: "Dashboard" },
              { img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=460&fit=crop", label: "Analytics" },
              { img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=700&h=460&fit=crop", label: "Campaigns" },
            ].map(({ img, label }, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-slate-800/30 shadow-2xl group hover:border-cyan-500/20 transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="py-4 px-5 bg-slate-800/90 backdrop-blur-sm text-cyan-300 text-sm font-medium text-center border-t border-white/5">{label}</p>
              </div>
            ))}
          </div>
          {/* Second row of images */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&h=320&fit=crop",
              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&h=320&fit=crop",
              "https://images.unsplash.com/photo-1552581234-26160f608093?w=500&h=320&fit=crop",
              "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&h=320&fit=crop",
            ].map((src, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden border border-white/10 aspect-video shadow-lg group">
                <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-cyan-500/10 via-slate-800/50 to-violet-500/10 border border-cyan-500/20 p-10 sm:p-14 shadow-2xl shadow-cyan-500/5">
            <Quote className="absolute top-8 start-8 w-12 h-12 text-cyan-500/20" />
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-amber-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-slate-200 text-xl sm:text-2xl leading-relaxed mb-8 font-medium">
              &ldquo;{t("demo.landing.testimonial")}&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full ring-2 ring-cyan-500/30 overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" alt="" className="w-full h-full object-cover" />
              </div>
              <p className="text-slate-400 text-sm font-medium">{t("demo.landing.testimonialAuthor")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width image break */}
      <section className="py-0">
        <div className="relative w-full aspect-[16/6] max-h-[380px] overflow-hidden">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&h=520&fit=crop" alt="" className="w-full h-full object-cover" />
          <div className={isLight ? "absolute inset-0 bg-white/8" : "absolute inset-0 bg-slate-950/40"} />
        </div>
      </section>

      {/* Second testimonial */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-rose-500/10 via-slate-800/50 to-amber-500/10 border border-rose-500/20 p-10 sm:p-14 shadow-2xl shadow-rose-500/5">
            <Quote className="absolute top-8 end-8 w-12 h-12 text-rose-500/20" />
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-amber-400 text-xl">★</span>
              ))}
            </div>
            <p className="text-slate-200 text-lg sm:text-xl leading-relaxed mb-8">
              &ldquo;Fast delivery, clear communication, and the landing page converts like crazy. Highly recommend.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full ring-2 ring-rose-500/30 overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="" className="w-full h-full object-cover" />
              </div>
              <p className="text-slate-500 text-sm">— Alex K., Product Manager</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 border-y border-white/5 bg-slate-900/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Meet the team</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent mx-auto mb-4" />
            <p className="text-slate-500">The people behind your success.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            {[
              { img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", name: "Jordan", role: "Lead" },
              { img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", name: "Sam", role: "Design" },
              { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", name: "Taylor", role: "Dev" },
              { img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", name: "Morgan", role: "Support" },
            ].map((p, i) => (
              <div key={i} className="text-center group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white/10 mx-auto mb-4 shadow-xl group-hover:border-cyan-500/30 group-hover:shadow-cyan-500/10 transition-all duration-300">
                  <img src={p.img} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="font-semibold text-white">{p.name}</p>
                <p className="text-slate-500 text-sm">{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Frequently asked questions</h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto" />
          </div>
          <div className="space-y-3">
            {[
              { q: "How fast can I get started?", a: "Most customers are up and running within 24 hours. We'll guide you through every step.", accent: "cyan" },
              { q: "Do you offer a free trial?", a: "Yes. 14 days free, no credit card required. Cancel anytime.", accent: "emerald" },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and bank transfer for annual plans.", accent: "violet" },
              { q: "Can I change my plan later?", a: "Absolutely. Upgrade or downgrade whenever you need. We'll prorate the difference.", accent: "amber" },
            ].map((faq, i) => (
              <div key={i} className={`rounded-2xl border p-6 transition-colors duration-200 ${faq.accent === "cyan" ? "border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10" : faq.accent === "emerald" ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10" : faq.accent === "violet" ? "border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10" : "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"}`}>
                <p className="font-semibold text-white mb-2">{faq.q}</p>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-20 px-4 border-y border-white/5 bg-slate-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-500 text-sm font-medium mb-10 tracking-wide">Trusted by teams everywhere</p>
          <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6 text-xl font-semibold">
            <span className="text-cyan-400/90">Acme</span>
            <span className="text-emerald-400/90">Globex</span>
            <span className="text-violet-400/90">Initech</span>
            <span className="text-amber-400/90">Umbrella</span>
            <span className="text-rose-400/90">Wayne</span>
          </div>
        </div>
      </section>

      {/* Checkout / Payment */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Secure checkout</h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Pay with Apple Pay or Google Pay.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-8 space-y-4 shadow-xl">
            <button type="button" onClick={handleCtaClick} className="w-full py-4 rounded-xl bg-[#000] text-[#f8fafc] font-semibold flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/20">
              Apple Pay
            </button>
            <button type="button" onClick={handleCtaClick} className="w-full py-4 rounded-xl bg-white text-slate-800 font-semibold flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-200">
              Google Pay
            </button>
            <p className="text-slate-500 text-xs text-center pt-2">Demo — no real payment</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4">
        <div className="max-w-xl mx-auto text-center rounded-3xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 p-12 sm:p-16 shadow-2xl shadow-black/20">
          <Mail className="w-14 h-14 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Stay in the loop</h2>
          <p className="text-slate-400 text-sm mb-8">Get tips and updates. No spam, unsubscribe anytime.</p>
          {newsletterSuccess ? (
            <p className="text-emerald-400 font-medium">Thank you! We received your message and will get back to you soon.</p>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newsletterEmail.trim()) return;
              try {
                await apiRequest("POST", "/api/contact", {
                  name: newsletterEmail.trim().split("@")[0],
                  email: newsletterEmail.trim(),
                  subject: "Landing Page Demo - Contact Form",
                  message: "Newsletter signup from landing page demo.",
                  service: "websites",
                });
              } catch { /* still show success */ }
              setNewsletterSuccess(true);
            }} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
              />
              <button type="submit" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold whitespace-nowrap shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-shadow">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-4">
        <div className="max-w-3xl mx-auto text-center rounded-[2rem] bg-gradient-to-br from-cyan-500/15 via-slate-800/80 to-emerald-500/15 border border-cyan-500/30 p-14 sm:p-20 shadow-2xl shadow-cyan-500/10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t("demo.landing.finalCta")}</h2>
          <p className="text-slate-400 text-lg mb-10">{t("demo.landing.ctaSubtitle")}</p>
          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-2 px-12 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold text-lg shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-300 border border-cyan-400/20"
          >
            {t("demo.landing.ctaStart")}
            <ArrowRight className="w-5 h-5 rtl:rotate-180" aria-hidden />
          </button>
        </div>
      </section>
    </div>
  );
}
