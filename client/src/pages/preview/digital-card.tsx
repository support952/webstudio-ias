import { Mail, Phone, Linkedin, Globe, Share2, Copy, Download, QrCode } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { SEOHead } from "@/components/seo-head";
import { PreviewPageControls } from "@/components/preview-page-controls";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/lib/theme";

export default function PreviewDigitalCard() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"card" | "share" | "details">("card");
  const [actionSuccess, setActionSuccess] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDemoAction = async () => {
    try {
      await apiRequest("POST", "/api/contact", {
        name: "Digital Card Visitor",
        email: "visitor@digital-card-demo.com",
        subject: "Digital Card Demo - Contact Form",
        message: "Inquiry from digital card demo page.",
        service: "digital_business_card",
      });
    } catch { /* still show success */ }
    setActionSuccess(true);
    setTimeout(() => setActionSuccess(false), 3000);
  };

  return (
    <div
      dir="ltr"
      lang="en"
      className={`preview-page ${isLight ? "preview-light bg-background text-foreground" : "preview-dark bg-gradient-to-br from-slate-950 via-violet-950/30 to-slate-950"} min-h-screen flex flex-col items-stretch p-4 py-12 sm:p-6 gap-6 max-w-3xl mx-auto`}
    >
      <SEOHead title="Digital Card Preview" path="/preview/digital-card" />
      <PreviewPageControls />
      {actionSuccess && (
        <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-medium shadow-lg">
          Thank you! We received your message and will get back to you soon.
        </div>
      )}
      {typeof window !== "undefined" && window.self !== window.top && (
        <div className="fixed top-0 inset-x-0 z-50 h-9 bg-black/60 backdrop-blur-sm border-b border-white/5 flex items-center justify-end px-4">
          <button
            type="button"
            onClick={() => window.parent?.postMessage?.({ type: "webstudio-close-demo" }, "*")}
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {t("demo.backToExamples")}
          </button>
        </div>
      )}

      {/* Tabs for mobile */}
      <div className="flex sm:hidden gap-2 border-b border-white/10 pb-4">
        {(["card", "share", "details"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? "bg-violet-500/20 text-violet-300" : "text-slate-400 hover:text-white"
            }`}
          >
            {tab === "card" ? "Card" : tab === "share" ? "Share" : "Details"}
          </button>
        ))}
      </div>

      {/* Card panel */}
      <div className={`w-full max-w-[420px] mx-auto shrink-0 ${activeTab !== "card" ? "hidden sm:block" : ""}`}>
        <div className="relative rounded-[2rem] p-[2px] bg-gradient-to-br from-cyan-500/60 via-violet-500/40 to-rose-500/50 shadow-2xl shadow-cyan-500/15">
          <div className={`rounded-[calc(2rem-2px)] overflow-hidden ${isLight ? "bg-white" : "bg-slate-900"}`}>
            <div className="relative h-32 sm:h-36 overflow-hidden">
              <div className={`absolute inset-0 ${isLight ? "bg-gradient-to-br from-cyan-300/45 via-violet-300/35 to-rose-300/30" : "bg-gradient-to-br from-cyan-600/70 via-violet-600/50 to-rose-600/40"}`} />
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop"
                alt=""
                loading="lazy"
                className={`w-full h-full object-cover ${isLight ? "opacity-28" : "opacity-65"}`}
              />
              <div className={`absolute inset-0 ${isLight ? "bg-gradient-to-t from-white via-white/70 to-transparent" : "bg-gradient-to-t from-slate-900 via-transparent to-transparent"}`} />
            </div>
            <div className="relative px-6 pb-6 -mt-14">
              <div className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-2xl border-4 overflow-hidden shadow-xl ring-2 ring-cyan-400/40 mb-4 ${isLight ? "border-white" : "border-slate-900"}`}>
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className={`text-xl font-bold mb-0.5 ${isLight ? "text-slate-900" : "text-white"}`}>Alex Chen</h1>
                <p className={`text-sm font-semibold mb-0.5 ${isLight ? "text-cyan-700" : "text-cyan-400"}`}>Product Designer</p>
                <p className={`text-xs mb-5 ${isLight ? "text-slate-600" : "text-slate-500"}`}>WebStudio</p>
                <div className={`w-full h-px mb-5 ${isLight ? "bg-slate-200" : "bg-white/10"}`} />
                <div className="flex flex-wrap justify-center gap-3 w-full">
                  <a href="https://mail.google.com/mail/?view=cm&to=alex%40example.com" target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center min-w-[44px] h-11 rounded-xl border transition-all ${isLight ? "bg-slate-100 hover:bg-cyan-100 border-slate-300 hover:border-cyan-300 text-slate-700" : "bg-white/10 hover:bg-cyan-500/20 border-white/10 hover:border-cyan-500/30 text-white"}`} aria-label="Email">
                    <Mail className="w-5 h-5" />
                  </a>
                  <a href="tel:+1234567890" className={`flex items-center justify-center min-w-[44px] h-11 rounded-xl border transition-all ${isLight ? "bg-slate-100 hover:bg-cyan-100 border-slate-300 hover:border-cyan-300 text-slate-700" : "bg-white/10 hover:bg-cyan-500/20 border-white/10 hover:border-cyan-500/30 text-white"}`} aria-label="Phone">
                    <Phone className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center min-w-[44px] h-11 rounded-xl border transition-all ${isLight ? "bg-slate-100 hover:bg-cyan-100 border-slate-300 hover:border-cyan-300 text-slate-700" : "bg-white/10 hover:bg-cyan-500/20 border-white/10 hover:border-cyan-500/30 text-white"}`} aria-label="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className={`flex items-center justify-center min-w-[44px] h-11 rounded-xl border transition-all ${isLight ? "bg-slate-100 hover:bg-cyan-100 border-slate-300 hover:border-cyan-300 text-slate-700" : "bg-white/10 hover:bg-cyan-500/20 border-white/10 hover:border-cyan-500/30 text-white"}`} aria-label="Website">
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
                <p className={`text-[11px] mt-4 px-2 ${isLight ? "text-slate-600" : "text-slate-500"}`}>{t("demo.cardDisclaimer")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: Share + Details */}
      <div className="w-full flex flex-col gap-6 min-w-0">
        {/* Share panel */}
        <div className={`rounded-2xl border border-violet-500/20 ${isLight ? "bg-white/90" : "bg-gradient-to-br from-violet-500/10 to-slate-900/90"} p-6 ${activeTab !== "share" ? "hidden sm:block" : ""}`}>
          <h3 className={`flex items-center gap-2 font-bold mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
            <Share2 className="w-5 h-5 text-violet-400" />
            Share this card
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                value="https://card.example.com/alex-chen"
                className={`flex-1 px-4 py-3 rounded-xl text-sm ${isLight ? "bg-slate-100 border border-slate-300 text-slate-700" : "bg-white/5 border border-white/10 text-slate-300"}`}
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 border transition-colors ${
                  isLight
                    ? "bg-cyan-600/20 text-cyan-700 hover:bg-cyan-600/30 border-cyan-600/35"
                    : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border-cyan-500/30"
                }`}
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className={`rounded-xl p-4 flex items-center gap-4 ${isLight ? "border border-slate-300 bg-slate-100" : "border border-white/10 bg-white/5"}`}>
              <div className="w-20 h-20 rounded-lg bg-white flex items-center justify-center shrink-0">
                <QrCode className="w-10 h-10 text-slate-400" />
              </div>
              <div>
                <p className={`font-medium text-sm ${isLight ? "text-slate-900" : "text-white"}`}>QR code</p>
                <p className={`text-xs ${isLight ? "text-slate-600" : "text-slate-500"}`}>Scan to save contact</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleDemoAction} className={`px-4 py-2 rounded-lg text-sm font-medium border ${isLight ? "bg-blue-600/15 text-blue-700 border-blue-600/35 hover:bg-blue-600/25" : "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30"}`}>LinkedIn</button>
              <button type="button" onClick={handleDemoAction} className={`px-4 py-2 rounded-lg text-sm font-medium border ${isLight ? "bg-sky-600/15 text-sky-700 border-sky-600/35 hover:bg-sky-600/25" : "bg-sky-500/20 text-sky-300 border-sky-500/30 hover:bg-sky-500/30"}`}>Twitter</button>
              <button type="button" onClick={handleDemoAction} className={`px-4 py-2 rounded-lg text-sm font-medium border ${isLight ? "bg-emerald-600/15 text-emerald-700 border-emerald-600/35 hover:bg-emerald-600/25" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"}`}>WhatsApp</button>
            </div>
          </div>
        </div>

        {/* Actions panel */}
        <div className={`rounded-2xl border border-emerald-500/20 ${isLight ? "bg-white/90" : "bg-gradient-to-br from-emerald-500/10 to-slate-900/90"} p-6`}>
          <h3 className={`${isLight ? "text-slate-900" : "text-white"} font-bold mb-4`}>Save contact</h3>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleDemoAction} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium border transition-colors ${
              isLight
                ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/30"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
            }`}>
              <Download className="w-4 h-4" />
              Add to contacts
            </button>
            <button type="button" onClick={handleDemoAction} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium border transition-colors ${
              isLight
                ? "bg-slate-500/20 text-slate-700 border-slate-500/25 hover:bg-slate-500/30"
                : "bg-white/10 text-slate-300 border-white/10 hover:bg-white/15"
            }`}>
              <Download className="w-4 h-4" />
              Download vCard
            </button>
          </div>
        </div>

        {/* Details view (list) */}
        <div className={`rounded-2xl border border-cyan-500/20 ${isLight ? "bg-white/90" : "bg-gradient-to-br from-cyan-500/10 to-slate-900/90"} p-6 ${activeTab !== "details" ? "hidden sm:block" : ""}`}>
          <h3 className={`${isLight ? "text-slate-900" : "text-white"} font-bold mb-4`}>Contact details</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/10">
              <dt className={isLight ? "text-slate-600" : "text-slate-500"}>Name</dt>
              <dd className={`${isLight ? "text-slate-900" : "text-white"} font-medium`}>Alex Chen</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <dt className={isLight ? "text-slate-600" : "text-slate-500"}>Title</dt>
              <dd className={`${isLight ? "text-slate-900" : "text-white"} font-medium`}>Product Designer</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <dt className={isLight ? "text-slate-600" : "text-slate-500"}>Company</dt>
              <dd className={`${isLight ? "text-slate-900" : "text-white"} font-medium`}>WebStudio</dd>
            </div>
            <div className="flex justify-between py-2 border-b border-white/10">
              <dt className={isLight ? "text-slate-600" : "text-slate-500"}>Email</dt>
              <dd className={isLight ? "text-cyan-700" : "text-cyan-400"}>alex@example.com</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className={isLight ? "text-slate-600" : "text-slate-500"}>Phone</dt>
              <dd className={isLight ? "text-cyan-700" : "text-cyan-400"}>+1 234 567 890</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
