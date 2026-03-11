import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

export type DemoProductId = "websites" | "landing" | "digital-card" | "marketing";

type ProductContactFormProps = {
  productId: DemoProductId;
  subjectKey: string;
};

const CONTACT_DRAFT_KEY = "contact_draft";

/** Map productId to questionnaire service type */
function toQuestionnaireService(productId: DemoProductId): "websites" | "digital_business_card" | "marketing_ppc" {
  if (productId === "digital-card") return "digital_business_card";
  if (productId === "marketing") return "marketing_ppc";
  return "websites";
}

export function ProductContactForm({ productId, subjectKey }: ProductContactFormProps) {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: t("demo.form.error"), description: t("demo.form.fillRequired"), variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const draft = {
        name: name.trim(),
        email: email.trim(),
        subject: t(subjectKey),
        message: message.trim() || t("demo.form.defaultMessage"),
        service: toQuestionnaireService(productId),
      };
      sessionStorage.setItem(CONTACT_DRAFT_KEY, JSON.stringify(draft));
      setLocation("/contact/questionnaire");
    } catch (err) {
      toast({ title: t("demo.form.error"), description: (err as Error).message || t("contact.errorDesc"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-border mt-16 pt-12">
      <h2 className="text-xl font-semibold text-foreground mb-2">{t("demo.form.title")}</h2>
      <p className="text-muted-foreground text-sm mb-6">{t("demo.form.subtitle")}</p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="demo-name" className="text-muted-foreground">
            {t("demo.form.name")} *
          </Label>
          <Input
            id="demo-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 bg-background/80 border-border text-foreground placeholder:text-muted-foreground"
            placeholder={t("demo.form.namePlaceholder")}
            required
          />
        </div>
        <div>
          <Label htmlFor="demo-email" className="text-slate-300">
            {t("demo.form.email")} *
          </Label>
          <Input
            id="demo-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 bg-white/5 border-white/10 text-white"
            placeholder={t("demo.form.emailPlaceholder")}
            required
          />
        </div>
        <div>
          <Label htmlFor="demo-message" className="text-muted-foreground">
            {t("demo.form.message")}
          </Label>
          <Textarea
            id="demo-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 bg-background/80 border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
            placeholder={t("demo.form.messagePlaceholder")}
          />
        </div>
        <Button type="submit" disabled={loading} className="bg-cyan-500 hover:bg-cyan-600">
          {loading ? t("demo.form.sending") : t("demo.form.submit")}
        </Button>
      </form>
    </section>
  );
}
