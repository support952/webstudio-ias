import { useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";
import {
  getQuestionsForService,
  getMissingRequiredFieldIds,
  isQuestionRequired,
  type QuestionDef,
  type ServiceType,
} from "@/lib/questionnaireConfig";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const QUESTION_FIELD_ID_PREFIX = "sq-field-";

function scrollToAndFocusField(id: string) {
  const root = document.getElementById(`${QUESTION_FIELD_ID_PREFIX}${id}`);
  if (!root) return;
  root.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    const focusable =
      root.querySelector<HTMLElement>("textarea") ||
      root.querySelector<HTMLElement>("input:not([type='hidden']):not([type='file'])") ||
      root.querySelector<HTMLElement>("button");
    focusable?.focus({ preventScroll: true });
  }, 350);
}

const SERVICES: ServiceType[] = ["websites", "digital_business_card", "marketing_ppc"];

export default function StandaloneQuestionnaire() {
  const { t, lang, setLang } = useI18n();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState<ServiceType>("websites");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attachmentFiles, setAttachmentFiles] = useState<Array<{ name: string; type: string; base64: string }>>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [validationHighlightId, setValidationHighlightId] = useState<string | null>(null);

  const questions = getQuestionsForService(service);

  const handleChange = (questionId: string, value: string) => {
    setValidationHighlightId(null);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleServiceChange = (val: string) => {
    setService(val as ServiceType);
    setAnswers({});
    setValidationHighlightId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate contact fields
    if (!name.trim()) {
      toast({ title: t("questionnaire.requiredError"), description: t("questionnaire.fillRequired"), variant: "destructive" });
      scrollToAndFocusField("_name");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast({ title: t("questionnaire.requiredError"), description: t("questionnaire.fillRequired"), variant: "destructive" });
      scrollToAndFocusField("_email");
      return;
    }

    // Validate questionnaire fields
    const missing = getMissingRequiredFieldIds(questions, answers);
    if (missing.length > 0) {
      const first = missing[0]!;
      setValidationHighlightId(first);
      toast({ title: t("questionnaire.requiredError"), description: t("questionnaire.fillRequired"), variant: "destructive" });
      window.setTimeout(() => scrollToAndFocusField(first), 0);
      return;
    }

    setSending(true);
    try {
      const payloadAnswers = { ...answers };
      if (attachmentFiles.length > 0) {
        (payloadAnswers as Record<string, unknown>)._attachments = attachmentFiles;
      }
      await apiRequest("POST", "/api/contact", {
        name: name.trim(),
        email: email.trim(),
        subject: t(`contact.serviceOptions.${service}`),
        message: `[Standalone questionnaire] ${t(`contact.serviceOptions.${service}`)}`,
        service,
        questionnaireAnswers: payloadAnswers,
      });
      setSent(true);
      toast({ title: t("contact.success"), description: t("contact.successDesc") });
    } catch {
      toast({ title: t("contact.error"), description: t("contact.errorDesc"), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <PageWrapper>
        <SEOHead title="Questionnaire" path="/questionnaire" />
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <section className="pt-safe-lg pb-24 sm:pb-32 relative">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-md p-8 sm:p-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-6">
                  <Send className="w-7 h-7 text-neon-cyan" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">{t("contact.success")}</h2>
                <p className="text-muted-foreground">{t("contact.successDesc")}</p>
              </motion.div>
            </div>
          </section>
          <Footer />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <SEOHead title="Questionnaire" path="/questionnaire" />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section id="main-content" className="pt-safe-lg pb-24 sm:pb-32 relative">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-md p-6 sm:p-8"
            >
              {/* Language selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
                <p className="text-neon-cyan text-sm font-medium uppercase tracking-widest mb-0">
                  {t("questionnaire.service_label")}
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Questionnaire language">
                  {(["en", "he", "es", "fr"] as const).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLang(code)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        lang === code
                          ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                          : "bg-background/80 text-muted-foreground hover:text-foreground border border-border"
                      }`}
                    >
                      {t("questionnaire.viewIn")} {t(`questionnaire.lang.${code}`)}
                    </button>
                  ))}
                </div>
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-6">{t("questionnaire.title")}</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div id={`${QUESTION_FIELD_ID_PREFIX}_name`} className="scroll-mt-28 sm:scroll-mt-36">
                  <label className="block text-sm text-muted-foreground mb-2">
                    {t("contact.name")}
                    <span className="text-red-400 ms-0.5" aria-hidden>*</span>
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-required
                    className="bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                {/* Email */}
                <div id={`${QUESTION_FIELD_ID_PREFIX}_email`} className="scroll-mt-28 sm:scroll-mt-36">
                  <label className="block text-sm text-muted-foreground mb-2">
                    {t("contact.email")}
                    <span className="text-red-400 ms-0.5" aria-hidden>*</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-required
                    className="bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    {t("contact.service")}
                    <span className="text-red-400 ms-0.5" aria-hidden>*</span>
                  </label>
                  <Select value={service} onValueChange={handleServiceChange}>
                    <SelectTrigger className="bg-background/80 border-border text-foreground">
                      <SelectValue placeholder={t("contact.servicePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s} value={s} className="focus:bg-accent focus:text-foreground">
                          {t(`contact.serviceOptions.${s}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Divider */}
                <div className="border-t border-border pt-4" />

                {/* Service-specific questions */}
                {questions.map((q) => (
                  <div
                    key={q.id}
                    id={`${QUESTION_FIELD_ID_PREFIX}${q.id}`}
                    className={cn(
                      "scroll-mt-28 sm:scroll-mt-36 rounded-lg transition-shadow",
                      validationHighlightId === q.id &&
                        "ring-2 ring-destructive ring-offset-2 ring-offset-background",
                    )}
                  >
                    <QuestionField
                      question={q}
                      value={answers[q.id] ?? ""}
                      onChange={(v) => handleChange(q.id, v)}
                      t={t}
                      required={isQuestionRequired(q, answers)}
                    />
                  </div>
                ))}

                {/* File upload */}
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">{t("questionnaire.uploadFiles")}</label>
                  <p className="text-xs text-muted-foreground mb-2">{t("questionnaire.uploadFilesHint")}</p>
                  <div className="flex flex-wrap gap-2">
                    {attachmentFiles.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-md bg-background/80 border border-border px-2 py-1 text-xs text-foreground"
                      >
                        {f.name}
                        <button
                          type="button"
                          onClick={() => setAttachmentFiles((prev) => prev.filter((_, j) => j !== i))}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    <label className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary cursor-pointer">
                      <Paperclip className="w-4 h-4" />
                      {t("questionnaire.addFile")}
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files?.length) return;
                          const add: Array<{ name: string; type: string; base64: string }> = [];
                          let done = 0;
                          const total = files.length;
                          const onDone = () => {
                            done++;
                            if (done === total) {
                              setAttachmentFiles((prev) => [...prev, ...add]);
                            }
                          };
                          for (let i = 0; i < files.length; i++) {
                            const f = files[i];
                            if (f.size > 10 * 1024 * 1024) {
                              onDone();
                              continue;
                            }
                            const r = new FileReader();
                            r.onload = () => {
                              add.push({ name: f.name, type: f.type, base64: String(r.result) });
                              onDone();
                            };
                            r.readAsDataURL(f);
                          }
                          if (total === 0) onDone();
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0"
                >
                  {sending ? t("questionnaire.sending") : t("questionnaire.submit")}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}

function QuestionField({
  question,
  value,
  onChange,
  t,
  required,
}: {
  question: QuestionDef;
  value: string;
  onChange: (v: string) => void;
  t: (key: string) => string;
  required?: boolean;
}) {
  const label = t(question.labelKey);
  const placeholder = question.placeholderKey ? t(question.placeholderKey) : undefined;
  const labelEl = (
    <label className="block text-sm text-muted-foreground mb-2">
      {label}
      {required && <span className="text-red-400 ms-0.5" aria-hidden>*</span>}
    </label>
  );

  if (question.type === "textarea") {
    return (
      <div>
        {labelEl}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          aria-required={required}
          className="bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus:border-primary resize-none"
        />
      </div>
    );
  }

  if (question.type === "select") {
    return (
      <div>
        {labelEl}
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger aria-required={required} className="bg-background/80 border-border text-foreground">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {(question.options ?? []).map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="focus:bg-accent focus:text-foreground">
                {t(opt.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (question.type === "radio") {
    return (
      <div>
        {labelEl}
        <div className="flex gap-4 flex-wrap">
          {(question.options ?? []).map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
                className="accent-neon-purple"
              />
              <span className="text-foreground text-sm">{t(opt.labelKey)}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {labelEl}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-required={required}
        className="bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
      />
    </div>
  );
}
