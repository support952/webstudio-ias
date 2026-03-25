import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { ContactPageJsonLd } from "@/components/json-ld";
import { openLiveChat } from "@/lib/live-chat-events";
import { useI18n } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";

const CONTACT_DRAFT_KEY = "contact_draft";

/** Map product/plan to display label and to questionnaire service type */
const productToService: Record<string, string> = {
  websites: "Ecommerce",
  landing: "LandingPage",
  card: "DigitalCards",
  marketing: "Branding",
};

const planIdToService: Record<string, string> = {
  starter: "Starter Plan",
  pro: "Pro Plan",
  enterprise: "Enterprise Plan",
};

/** Questionnaire expects service: "websites" | "digital_business_card" | "marketing_ppc" */
function toQuestionnaireService(projectType: string): string {
  if (projectType === "DigitalCards") return "digital_business_card";
  if (projectType === "Branding") return "marketing_ppc";
  return "websites";
}

const MARKETING_SECTIONS = [
  { titleKey: "marketing.details.s1.title", descKey: "marketing.details.s1.desc" },
  { titleKey: "marketing.details.s2.title", descKey: "marketing.details.s2.desc" },
  { titleKey: "marketing.details.s3.title", descKey: "marketing.details.s3.desc" },
  { titleKey: "marketing.details.s4.title", descKey: "marketing.details.s4.desc" },
] as const;

export default function Contact() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { t } = useI18n();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const rawSearch = typeof search === "string" ? search : "";
  const normalizedSearch = rawSearch.startsWith("?") ? rawSearch : `?${rawSearch}`;
  const params = new URLSearchParams(normalizedSearch);
  const serviceParam = params.get("service");
  const planParam = params.get("plan");
  const productParam = params.get("product");

  const projectType =
    serviceParam ??
    (planParam && planIdToService[planParam] ? planIdToService[planParam] : null) ??
    (productParam && productToService[productParam] ? productToService[productParam] : null) ??
    "General Inquiry";

  const planSubject = planParam && planIdToService[planParam] ? planIdToService[planParam] : null;
  const productId = productParam && ["websites", "landing", "card", "marketing"].includes(productParam) ? productParam : null;
  const productSubject = productId ? t(productId === "marketing" ? "marketing.details.title" : `examples.${productId}.title`) : null;

  const headerTitle = projectType && projectType !== "General Inquiry"
    ? t("contact.serviceTitleTemplate").replace("{service}", projectType)
    : t("contact.title");
  const headerSubtitle = projectType && projectType !== "General Inquiry"
    ? t("contact.serviceSubtitleTemplate").replace("{service}", projectType)
    : t("contact.subtitle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("Name") as string)?.trim() || "";
    const email = (formData.get("Email") as string)?.trim() || "";
    const message = (formData.get("Message") as string)?.trim() || "";
    if (!name || !email) {
      toast({ title: t("contact.error"), description: t("contact.errorDesc"), variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const draft = {
        name,
        email,
        subject: projectType,
        message: message || t("contact.defaultMessage"),
        service: toQuestionnaireService(projectType),
      };
      sessionStorage.setItem(CONTACT_DRAFT_KEY, JSON.stringify(draft));
      await apiRequest("POST", "/api/contact/stage-transition", {
        stage: "step_1_to_step_2",
        ...draft,
      }).catch(() => null);
      setLocation("/contact/questionnaire");
    } catch {
      toast({ title: t("contact.error"), description: t("contact.errorDesc"), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <PageWrapper>
      <SEOHead title="Contact Us" path="/contact" />
      <ContactPageJsonLd />
      <div className="min-h-screen text-foreground font-sans antialiased">
        <Navbar />

        <main id="main-content">
          <section className="pt-safe-contact pb-20 sm:pb-28 relative overflow-hidden">
            <div className="absolute top-1/4 end-0 w-[420px] h-[420px] rounded-full bg-neon-pink/10 blur-[110px] pointer-events-none animate-pulse-soft" />
            <div className="absolute bottom-1/3 start-0 w-[320px] h-[320px] rounded-full bg-neon-cyan/8 blur-[90px] pointer-events-none animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
            <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-neon-purple/5 blur-[60px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-20 contact-page-header"
              >
                <span className="inline-block text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-primary/90 contact-header-label mb-4">
                  {t("contact.label")}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-foreground contact-header-title mb-4" data-testid="text-contact-title">
                  {headerTitle.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="gradient-text">{headerTitle.split(" ").pop()}</span>
                </h1>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-6" />
                <p className="text-base sm:text-lg text-muted-foreground contact-header-subtitle max-w-2xl mx-auto leading-[1.7]">
                  {headerSubtitle}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="lg:col-span-3 space-y-6"
                >
                  {planParam && ["starter", "pro", "enterprise"].includes(planParam) && (
                    <div
                      className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-lg contact-plan-summary"
                      data-testid="contact-selected-plan"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        {t("contact.inquiringAbout")}
                      </p>
                      <h2 className="text-lg font-semibold text-foreground mb-2">{t(`pricing.${planParam}`)}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed contact-plan-summary-desc">{t(`pricing.${planParam}.desc`)}</p>
                    </div>
                  )}

                  {productId && !planParam && (
                    <div
                      className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-lg contact-plan-summary"
                      data-testid="contact-selected-product"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        {t("contact.inquiringAbout")}
                      </p>
                      <h2 className="text-lg font-semibold text-foreground mb-2">
                        {productId === "marketing" ? t("marketing.details.title") : t(`examples.${productId}.title`)}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed contact-plan-summary-desc mb-4">
                        {productId === "marketing" ? t("marketing.banner.subtitle") : t(`examples.${productId}.desc`)}
                      </p>
                      {productId === "marketing" && (
                        <div className="space-y-4 pt-3 border-t border-border">
                          {MARKETING_SECTIONS.map(({ titleKey, descKey }) => (
                            <div key={titleKey}>
                              <h3 className="text-sm font-semibold text-foreground mb-1">{t(titleKey)}</h3>
                              <p className="text-xs text-muted-foreground leading-relaxed">{t(descKey)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-border bg-card/80 contact-form-card p-6 sm:p-8 space-y-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/5 focus-within:shadow-xl focus-within:shadow-primary/5"
                    data-testid="form-contact"
                  >
                    <input type="hidden" name="Service" value={projectType} readOnly />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="contact-name" className="form-label text-sm block">{t("contact.name")}</label>
                        <Input
                          id="contact-name"
                          name="Name"
                          type="text"
                          required
                          placeholder="John Doe"
                          className="h-11 rounded-xl bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:border-primary transition-shadow"
                          data-testid="input-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="contact-email" className="form-label text-sm block">{t("contact.email")}</label>
                        <Input
                          id="contact-email"
                          name="Email"
                          type="email"
                          required
                          placeholder="john@example.com"
                          className="h-11 rounded-xl bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:border-primary transition-shadow"
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-message" className="form-label text-sm block">{t("contact.message")}</label>
                      <Textarea
                        id="contact-message"
                        name="Message"
                        placeholder="Tell us about your project..."
                        rows={5}
                        className="min-h-[120px] rounded-xl bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:border-primary resize-none transition-shadow"
                        data-testid="input-message"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 py-6 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      data-testid="button-submit-contact"
                    >
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {sending ? t("contact.sending") : t("contact.send")}
                      </span>
                    </Button>
                  </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="lg:col-span-2 space-y-5"
              >
                {[
                  { icon: Mail, labelKey: "contact.emailUs", value: "support@webstudio-ias.com", href: "https://mail.google.com/mail/?view=cm&to=support%40webstudio-ias.com", color: "text-neon-purple", bg: "bg-neon-purple/10", isExternal: true, valueLtr: true },
                  { icon: MessageCircle, labelKey: "contact.liveChat", valueKey: "contact.liveChat.value", href: "#", color: "text-neon-cyan", bg: "bg-neon-cyan/10", openChat: true, valueLtr: false },
                  { icon: MapPin, labelKey: "contact.location", valueKey: "contact.location.value", href: "https://maps.google.com/?q=2+N+Central+Ave+Phoenix+AZ+85004", color: "text-neon-pink", bg: "bg-neon-pink/10", isExternal: true, valueLtr: true },
                ].map((item) => {
                  const className = "flex items-center gap-5 p-6 rounded-2xl border border-border bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 group text-start";
                  const content = (
                    <>
                      <div className={`shrink-0 w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <div className="contact-card-inner flex-1 min-w-0 py-0.5 ps-0 rounded-e-xl">
                        <div className="contact-card-label text-xs uppercase tracking-wider mb-1 font-semibold">{t(item.labelKey)}</div>
                        <div
                          className="contact-card-value text-sm font-medium"
                          dir={item.valueLtr ? "ltr" : undefined}
                        >
                          {item.value || t(item.valueKey!)}
                        </div>
                      </div>
                    </>
                  );
                  if ("openChat" in item && item.openChat) {
                    return (
                      <button
                        key={item.labelKey}
                        type="button"
                        onClick={openLiveChat}
                        className={`${className} w-full`}
                        data-testid={`link-contact-${t(item.labelKey).toLowerCase().replace(/\s/g, "-")}`}
                      >
                        {content}
                      </button>
                    );
                  }
                  return (
                    <a
                      key={item.labelKey}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                      data-testid={`link-contact-${t(item.labelKey).toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {content}
                    </a>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
