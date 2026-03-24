import { useI18n } from "@/lib/i18n";
import {
  Megaphone,
  Target,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Users,
  MousePointerClick,
  DollarSign,
  CalendarDays,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { SEOHead } from "@/components/seo-head";
import { PreviewPageControls } from "@/components/preview-page-controls";
import { useTheme } from "@/lib/theme";

const creatives = [
  {
    id: "creative-a",
    title: "Video Reel - Summer Promo",
    channel: "Instagram / Facebook",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&h=600&fit=crop",
    ctr: "8.1%",
    cpl: "$4.20",
  },
  {
    id: "creative-b",
    title: "Carousel - Product Highlights",
    channel: "Meta Feed",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop",
    ctr: "6.9%",
    cpl: "$4.90",
  },
  {
    id: "creative-c",
    title: "Search Ad - High Intent",
    channel: "Google Ads",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&h=600&fit=crop",
    ctr: "9.4%",
    cpl: "$3.60",
  },
];

export default function PreviewMarketing() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`preview-page ${isLight ? "preview-light bg-background text-foreground" : "preview-dark bg-gradient-to-b from-slate-950 via-violet-950/20 to-slate-950 text-white"} min-h-screen`}>
      <SEOHead title="Marketing Campaign Demo" path="/preview/marketing" />
      <PreviewPageControls />

      {typeof window !== "undefined" && window.self !== window.top && (
        <div className={`fixed top-0 left-0 right-0 z-50 h-9 backdrop-blur-sm border-b flex items-center justify-end px-4 ${
          isLight ? "bg-white/80 border-slate-200" : "bg-black/60 border-white/5"
        }`}>
          <button
            type="button"
            onClick={() => window.parent?.postMessage?.({ type: "webstudio-close-demo" }, "*")}
            className={`text-xs transition-colors ${isLight ? "text-slate-600 hover:text-cyan-700" : "text-muted-foreground hover:text-primary"}`}
          >
            {t("demo.backToExamples")}
          </button>
        </div>
      )}

      <header className={`sticky top-0 z-40 pt-12 pb-4 px-4 sm:px-6 border-b backdrop-blur-xl ${
        isLight ? "bg-white/90 border-slate-200" : "bg-slate-950/90 border-white/10"
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? "bg-purple-100" : "bg-purple-500/20"}`}>
              <Megaphone className={`w-5 h-5 ${isLight ? "text-purple-700" : "text-purple-300"}`} />
            </div>
            <div>
              <p className={`font-bold text-lg ${isLight ? "text-slate-900" : "text-white"}`}>Campaign Demo</p>
              <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-400"}`}>Back-to-school lead generation</p>
            </div>
          </div>
          <nav className={`hidden sm:flex gap-5 text-sm font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
            <button type="button" onClick={() => scrollTo("summary")} className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Summary</button>
            <button type="button" onClick={() => scrollTo("creatives")} className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Creatives</button>
            <button type="button" onClick={() => scrollTo("audience")} className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Audience</button>
            <button type="button" onClick={() => scrollTo("results")} className={`transition-colors ${isLight ? "hover:text-slate-900" : "hover:text-white"}`}>Results</button>
          </nav>
        </div>
      </header>

      <section id="summary" className="px-4 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 rounded-3xl border p-7 ${isLight ? "bg-white border-slate-200" : "bg-slate-900/70 border-white/10"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-xs uppercase tracking-wider mb-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Campaign objective</p>
                <h1 className={`text-2xl sm:text-3xl font-extrabold leading-tight ${isLight ? "text-slate-900" : "text-white"}`}>
                  Generate qualified demo calls in 30 days
                </h1>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${isLight ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"}`}>
                Active
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-7">
              <div className={`rounded-2xl border p-4 ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-xs mb-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Budget</p>
                <p className={`text-xl font-bold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}><DollarSign className="w-4 h-4" />12,000</p>
              </div>
              <div className={`rounded-2xl border p-4 ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-xs mb-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Run dates</p>
                <p className={`text-xl font-bold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}><CalendarDays className="w-4 h-4" />Aug 1 - Aug 31</p>
              </div>
              <div className={`rounded-2xl border p-4 ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-xs mb-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>Primary KPI</p>
                <p className={`text-xl font-bold flex items-center gap-2 ${isLight ? "text-slate-900" : "text-white"}`}><Target className="w-4 h-4" />Cost per lead</p>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl border p-6 ${isLight ? "bg-white border-slate-200" : "bg-slate-900/70 border-white/10"}`}>
            <p className={`text-sm font-semibold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>Live pace</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={isLight ? "text-slate-600 text-sm" : "text-slate-400 text-sm"}>Spent</span>
                <span className={isLight ? "text-slate-900 font-semibold" : "text-white font-semibold"}>$7,450 / $12,000</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isLight ? "bg-slate-200" : "bg-white/10"}`}>
                <div className="h-full w-[62%] bg-gradient-to-r from-purple-500 to-cyan-500" />
              </div>
              <div className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>On track for monthly target</div>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <button type="button" className={`w-full rounded-xl py-2.5 text-sm font-semibold border flex items-center justify-center gap-2 ${
                isLight ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200" : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25"
              }`}>
                <PlayCircle className="w-4 h-4" />
                Launch variation
              </button>
              <button type="button" className={`w-full rounded-xl py-2.5 text-sm font-semibold border flex items-center justify-center gap-2 ${
                isLight ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200" : "bg-white/10 text-slate-200 border-white/15 hover:bg-white/15"
              }`}>
                <PauseCircle className="w-4 h-4" />
                Pause low performers
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="creatives" className={`px-4 py-12 border-y ${isLight ? "border-slate-200 bg-white/60" : "border-white/10 bg-slate-900/30"}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${isLight ? "text-slate-900" : "text-white"}`}>Campaign creatives</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {creatives.map((creative) => (
              <article key={creative.id} className={`rounded-2xl overflow-hidden border ${isLight ? "bg-white border-slate-300" : "bg-slate-900/75 border-white/10"}`}>
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={creative.image} alt={creative.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className={`text-xs mb-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{creative.channel}</p>
                  <h3 className={`font-semibold mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>{creative.title}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`rounded-lg p-2 text-center ${isLight ? "bg-slate-100" : "bg-white/10"}`}>
                      <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>CTR</p>
                      <p className="text-sm font-bold text-cyan-500">{creative.ctr}</p>
                    </div>
                    <div className={`rounded-lg p-2 text-center ${isLight ? "bg-slate-100" : "bg-white/10"}`}>
                      <p className={`text-[11px] ${isLight ? "text-slate-500" : "text-slate-400"}`}>CPL</p>
                      <p className="text-sm font-bold text-emerald-500">{creative.cpl}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="audience" className="px-4 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          <div className={`rounded-3xl border p-6 ${isLight ? "bg-white border-slate-200" : "bg-slate-900/70 border-white/10"}`}>
            <h3 className={`font-bold text-xl mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>Audience segments</h3>
            <div className="space-y-3">
              {[
                { name: "Ecommerce founders", size: "42%", icon: Users, color: "text-purple-400" },
                { name: "Marketing managers", size: "34%", icon: Target, color: "text-cyan-400" },
                { name: "Startup teams", size: "24%", icon: Megaphone, color: "text-emerald-400" },
              ].map((seg) => (
                <div key={seg.name} className={`rounded-xl border px-4 py-3 flex items-center justify-between ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
                  <div className="flex items-center gap-2">
                    <seg.icon className={`w-4 h-4 ${seg.color}`} />
                    <span className={isLight ? "text-slate-800 text-sm" : "text-slate-200 text-sm"}>{seg.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-cyan-500">{seg.size}</span>
                </div>
              ))}
            </div>
          </div>

          <div id="results" className={`rounded-3xl border p-6 ${isLight ? "bg-white border-slate-200" : "bg-slate-900/70 border-white/10"}`}>
            <h3 className={`font-bold text-xl mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>Results snapshot</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-2xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>Leads</p>
                <p className={`text-2xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>1,284</p>
              </div>
              <div className={`rounded-2xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>CPL</p>
                <p className={`text-2xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>$5.80</p>
              </div>
              <div className={`rounded-2xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>CTR</p>
                <p className={`text-2xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>7.8%</p>
              </div>
              <div className={`rounded-2xl p-4 border ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>ROAS</p>
                <p className={`text-2xl font-extrabold ${isLight ? "text-slate-900" : "text-white"}`}>4.9x</p>
              </div>
            </div>
            <div className={`mt-5 rounded-2xl border p-4 ${isLight ? "bg-emerald-50 border-emerald-200" : "bg-emerald-500/10 border-emerald-500/25"}`}>
              <p className={`text-sm flex items-center gap-2 ${isLight ? "text-emerald-700" : "text-emerald-300"}`}>
                <CheckCircle2 className="w-4 h-4" />
                Campaign is outperforming target by 18%
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`px-4 pb-16 ${isLight ? "" : ""}`}>
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-3xl border p-6 sm:p-8 ${isLight ? "bg-white border-slate-200" : "bg-slate-900/70 border-white/10"}`}>
            <h3 className={`font-bold text-2xl mb-2 ${isLight ? "text-slate-900" : "text-white"}`}>Campaign timeline</h3>
            <p className={`text-sm mb-6 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Execution steps for this exact campaign demo.</p>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { week: "Week 1", task: "Audience + offer tests", done: true },
                { week: "Week 2", task: "Creative A/B launch", done: true },
                { week: "Week 3", task: "Budget reallocation", done: true },
                { week: "Week 4", task: "Scale winners", done: false },
              ].map((step) => (
                <div key={step.week} className={`rounded-2xl border p-4 ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
                  <p className={`text-xs mb-2 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{step.week}</p>
                  <p className={`font-semibold text-sm mb-3 ${isLight ? "text-slate-900" : "text-white"}`}>{step.task}</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${step.done ? "text-emerald-500" : "text-amber-500"}`}>
                    {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                    {step.done ? "Completed" : "In progress"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold hover:scale-[1.02] transition-transform">
                Duplicate this campaign
                <ArrowRight className="w-4 h-4" />
              </button>
              <button type="button" className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border ${
                isLight ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200" : "bg-white/10 text-slate-200 border-white/20 hover:bg-white/15"
              }`}>
                Open full dashboard
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
