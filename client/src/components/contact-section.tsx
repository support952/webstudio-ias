import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`
  : null;

export function ContactSection() {
  const { toast } = useToast();
  const { t } = useI18n();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      toast({ title: t("contact.error"), description: "Formspree is not configured.", variant: "destructive" });
      return;
    }
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("Service", "General Inquiry");
    const name = (formData.get("Name") as string)?.trim() || "";
    const email = (formData.get("Email") as string)?.trim() || "";
    formData.set("_subject", `ליד חדש [General]: ${name || "לקוח"}`);
    formData.set("_replyto", email);
    setSending(true);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        toast({ title: t("contact.success"), description: t("contact.successDesc") });
        form.reset();
      } else {
        toast({ title: t("contact.error"), description: t("contact.errorDesc"), variant: "destructive" });
      }
    } catch {
      toast({ title: t("contact.error"), description: t("contact.errorDesc"), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section-spacing relative bg-transparent" data-testid="section-contact">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-neon-pink/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-section-label font-medium tracking-[0.2em] uppercase text-foreground" data-testid="text-contact-label">
            Get In Touch
          </span>
          <h2 className="text-section-title font-bold text-foreground mt-3 mb-4" data-testid="text-contact-title">
            Let's Start a{" "}
            <span className="gradient-text">Project</span>
          </h2>
          <p className="text-section-subtitle text-muted-foreground max-w-2xl mx-auto">
            Ready to bring your vision to life? Reach out and let's discuss how we can help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-md p-6 sm:p-8 space-y-5"
              data-testid="form-contact"
            >
              <input type="hidden" name="Service" value="General Inquiry" readOnly />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="contact-section-name" className="form-label text-sm block">Your Name</label>
                  <Input
                    id="contact-section-name"
                    name="Name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="bg-background/80 border-border text-foreground placeholder-contrast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-section-email" className="form-label text-sm block">Email Address</label>
                  <Input
                    id="contact-section-email"
                    name="Email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="bg-background/80 border-border text-foreground placeholder-contrast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-section-subject" className="form-label text-sm block">Subject</label>
                <Input
                  id="contact-section-subject"
                  name="Subject"
                  placeholder="Project Inquiry"
                  className="bg-background/80 border-border text-foreground placeholder-contrast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                  data-testid="input-subject"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-section-message" className="form-label text-sm block">Message</label>
                <Textarea
                  id="contact-section-message"
                  name="Message"
                  required
                  placeholder="Tell us about your project..."
                  rows={5}
                  className="bg-background/80 border-border text-foreground placeholder-contrast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary resize-none"
                  data-testid="input-message"
                />
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
                data-testid="button-submit-contact"
              >
                {sending ? (
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            {[
              {
                icon: Mail,
                label: "Email Us",
                value: "hello@webstudio.com",
                href: "mailto:hello@webstudio.com",
                color: "text-neon-purple",
                bg: "bg-neon-purple/10",
              },
              {
                icon: MessageCircle,
                label: "Live Chat",
                value: "Available 24/7",
                href: "#",
                color: "text-neon-cyan",
                bg: "bg-neon-cyan/10",
              },
              {
                icon: MapPin,
                label: t("contact.location"),
                value: t("contact.location.value"),
                href: "https://maps.google.com/?q=2+N+Central+Ave+Phoenix+AZ+85004",
                color: "text-neon-pink",
                bg: "bg-neon-pink/10",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 p-5 glass-card rounded-md transition-all duration-300 gradient-border group"
                data-testid={`link-contact-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-md ${item.bg} flex items-center justify-center`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="contact-card-inner flex-1 min-w-0 py-4 pl-2 pr-5 rounded-r-md">
                  <div className="contact-card-label text-xs uppercase tracking-wider mb-0.5 font-semibold">{item.label}</div>
                  <div className="contact-card-value text-sm font-medium">{item.value}</div>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
