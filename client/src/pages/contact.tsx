import { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { ContactPageJsonLd } from "@/components/json-ld";
import { useI18n } from "@/lib/i18n";

const CONTACT_DRAFT_KEY = "contact_draft";

const planIdToSubject: Record<string, string> = {
  starter: "Starter Plan",
  pro: "Pro Plan",
  enterprise: "Enterprise Plan",
};

export default function Contact() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { t } = useI18n();
  const { toast } = useToast();

  const planParam = typeof search === "string" && search.startsWith("?") ? new URLSearchParams(search).get("plan") : null;
  const planSubject = planParam && planIdToSubject[planParam] ? planIdToSubject[planParam] : null;

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: planSubject ?? "",
      message: planSubject ? `I'm interested in the ${planSubject}.` : "",
      service: "websites",
    },
  });

  useEffect(() => {
    if (planSubject) {
      form.setValue("subject", planSubject);
      form.setValue("message", `I'm interested in the ${planSubject}.`);
    }
  }, [planSubject, form]);

  const onNextStep = form.handleSubmit((data) => {
    try {
      sessionStorage.setItem(CONTACT_DRAFT_KEY, JSON.stringify(data));
      setLocation("/contact/questionnaire");
    } catch {
      toast({ title: t("contact.error"), description: t("contact.errorDesc"), variant: "destructive" });
    }
  });

  return (
    <PageWrapper>
      <SEOHead title="Contact Us" path="/contact" />
      <ContactPageJsonLd />
      <div className="min-h-screen text-foreground font-sans antialiased">
        <Navbar />

        <main id="main-content">
          <section className="pt-20 pb-16 sm:pt-24 sm:pb-20 relative">
            <div className="absolute top-1/3 right-0 w-[380px] h-[380px] rounded-full bg-neon-pink/8 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-[280px] h-[280px] rounded-full bg-neon-cyan/5 blur-[80px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-16"
              >
                <span className="text-section-label font-medium tracking-[0.2em] uppercase text-foreground">
                  {t("contact.label")}
                </span>
                <h1 className="text-section-title font-semibold tracking-[-0.02em] text-foreground mt-3 mb-3" data-testid="text-contact-title">
                  {t("contact.title").split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="gradient-text">{t("contact.title").split(" ").pop()}</span>
                </h1>
                <div className="w-10 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto mb-5" />
                <p className="text-section-subtitle text-muted-foreground max-w-xl mx-auto leading-[1.65]">
                  {t("contact.subtitle")}
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
                      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-lg contact-plan-summary"
                      data-testid="contact-selected-plan"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                        {t("contact.inquiringAbout")}
                      </p>
                      <h2 className="text-lg font-semibold text-foreground mb-2">{t(`pricing.${planParam}`)}</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed contact-plan-summary-desc">{t(`pricing.${planParam}.desc`)}</p>
                    </div>
                  )}
                  <Form {...form}>
                    <form
                      onSubmit={onNextStep}
                      className="rounded-2xl border border-border bg-card/80 contact-form-card p-6 sm:p-8 space-y-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
                      data-testid="form-contact"
                    >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="form-label text-sm">{t("contact.name")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                className="bg-background/80 border-border text-foreground placeholder-contrast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                                {...field}
                                data-testid="input-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="form-label text-sm">{t("contact.email")}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                className="bg-background/80 border-border text-foreground placeholder-contrast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                                {...field}
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="form-label text-sm">{t("contact.service")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? "websites"}
                          >
                            <FormControl>
                              <SelectTrigger
                                className="bg-background/80 border-border text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary data-[placeholder]:text-muted-foreground"
                                data-testid="select-service"
                              >
                                <SelectValue placeholder={t("contact.servicePlaceholder")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(
                                [
                                  "websites",
                                  "digital_business_card",
                                  "marketing_ppc",
                                ] as const
                              ).map((key) => (
                                <SelectItem
                                  key={key}
                                  value={key}
                                  className="focus:bg-accent focus:text-accent-foreground"
                                >
                                  {t(`contact.serviceOptions.${key}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="form-label text-sm">{t("contact.subject")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Project Inquiry"
                              className="bg-background/80 border-border text-foreground placeholder-contrast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                              {...field}
                              data-testid="input-subject"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="form-label text-sm">{t("contact.message")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your project..."
                              rows={5}
                              className="bg-background/80 border-border text-foreground placeholder-contrast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary resize-none"
                              {...field}
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 py-6 text-sm font-medium shadow-lg hover:shadow-xl transition-shadow duration-300"
                      data-testid="button-submit-contact"
                    >
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {t("contact.send")}
                      </span>
                    </Button>
                  </form>
                </Form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="lg:col-span-2 space-y-6"
              >
                {[
                  { icon: Mail, labelKey: "contact.emailUs", value: "support@webstudio-ias.com", href: "mailto:support@webstudio-ias.com", color: "text-neon-purple", bg: "bg-neon-purple/10" },
                  { icon: MessageCircle, labelKey: "contact.liveChat", valueKey: "contact.liveChat.value", href: "#", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
                  { icon: MapPin, labelKey: "contact.location", valueKey: "contact.location.value", href: "#", color: "text-neon-pink", bg: "bg-neon-pink/10" },
                ].map((item) => (
                  <a
                    key={item.labelKey}
                    href={item.href}
                    className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card/50 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg group"
                    data-testid={`link-contact-${t(item.labelKey).toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <div className={`shrink-0 w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shadow-md`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="contact-card-inner flex-1 min-w-0 py-0.5 pl-0 rounded-r-xl">
                      <div className="contact-card-label text-xs uppercase tracking-wider mb-0.5 font-semibold">{t(item.labelKey)}</div>
                      <div className="contact-card-value text-sm font-medium">{item.value || t(item.valueKey!)}</div>
                    </div>
                  </a>
                ))}
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
