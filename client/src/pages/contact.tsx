import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { useI18n } from "@/lib/i18n";
import { AiChatModal } from "@/components/ai-chat-modal";

export default function Contact() {
  const { toast } = useToast();
  const { t } = useI18n();
  const [showAiChat, setShowAiChat] = useState(false);
  const [clientInfo, setClientInfo] = useState<{ name?: string; email?: string }>({});

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      await apiRequest("POST", "/api/contact", data);
      return data;
    },
    onSuccess: (data) => {
      toast({ title: t("contact.success"), description: t("contact.successDesc") });
      setClientInfo({ name: data.name, email: data.email });
      form.reset();
      setShowAiChat(true);
    },
    onError: () => {
      toast({ title: t("contact.error"), description: t("contact.errorDesc"), variant: "destructive" });
    },
  });

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section className="pt-32 pb-24 sm:pt-40 sm:pb-32 relative">
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-neon-pink/5 blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-neon-cyan text-sm font-medium uppercase tracking-widest">
                {t("contact.label")}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4" data-testid="text-contact-title">
                {t("contact.title").split(" ").slice(0, -1).join(" ")}{" "}
                <span className="gradient-text">{t("contact.title").split(" ").pop()}</span>
              </h1>
              <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
                {t("contact.subtitle")}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-3"
              >
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                    className="glass-card rounded-md p-6 sm:p-8 space-y-5"
                    data-testid="form-contact"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-slate-300">{t("contact.name")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 focus:ring-neon-purple/20"
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
                            <FormLabel className="text-sm text-slate-300">{t("contact.email")}</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 focus:ring-neon-purple/20"
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
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-slate-300">{t("contact.subject")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Project Inquiry"
                              className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 focus:ring-neon-purple/20"
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
                          <FormLabel className="text-sm text-slate-300">{t("contact.message")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your project..."
                              rows={5}
                              className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 focus:ring-neon-purple/20 resize-none"
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
                      disabled={mutation.isPending}
                      className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
                      data-testid="button-submit-contact"
                    >
                      {mutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("contact.sending")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          {t("contact.send")}
                        </span>
                      )}
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
                  { icon: SiWhatsapp, labelKey: "contact.whatsapp", value: "+1 (555) 123-4567", href: "https://wa.me/15551234567", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                  { icon: MessageCircle, labelKey: "contact.liveChat", valueKey: "contact.liveChat.value", href: "#", color: "text-neon-cyan", bg: "bg-neon-cyan/10" },
                  { icon: MapPin, labelKey: "contact.location", valueKey: "contact.location.value", href: "#", color: "text-neon-pink", bg: "bg-neon-pink/10" },
                ].map((item) => (
                  <a
                    key={item.labelKey}
                    href={item.href}
                    className="flex items-center gap-4 p-5 glass-card rounded-md transition-all duration-300 gradient-border group"
                    data-testid={`link-contact-${t(item.labelKey).toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <div className={`shrink-0 w-12 h-12 rounded-md ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">{t(item.labelKey)}</div>
                      <div className="text-sm text-white font-medium">{item.value || t(item.valueKey!)}</div>
                    </div>
                  </a>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />

        <AiChatModal
          open={showAiChat}
          onClose={() => setShowAiChat(false)}
          clientInfo={clientInfo}
        />
      </div>
    </PageWrapper>
  );
}
