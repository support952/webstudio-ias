import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Paperclip, X } from "lucide-react";
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
import { getQuestionsForService, type QuestionDef } from "@/lib/questionnaireConfig";
import type { InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CONTACT_DRAFT_KEY = "contact_draft";
const CONTACT_FOR_AI_KEY = "contact_for_ai";

export default function ContactQuestionnaire() {
  const [, setLocation] = useLocation();
  const { t, lang, setLang } = useI18n();
  const { toast } = useToast();
  const [draft, setDraft] = useState<InsertContact | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attachmentFiles, setAttachmentFiles] = useState<Array<{ name: string; type: string; base64: string }>>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CONTACT_DRAFT_KEY);
      if (!raw) {
        setLocation("/contact");
        return;
      }
      const data = JSON.parse(raw) as InsertContact;
      setDraft(data);
    } catch {
      setLocation("/contact");
    }
  }, [setLocation]);

  if (!draft) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <span className="text-slate-400">...</span>
        </div>
      </PageWrapper>
    );
  }

  const service = draft.service ?? "websites";
  const questions = getQuestionsForService(service);
  const serviceLabelKey = `contact.serviceOptions.${service}`;

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredIds = questions.filter((q) => (q as { required?: boolean }).required).map((q) => q.id);
    const missing = requiredIds.filter((id) => !String(answers[id] ?? "").trim());
    if (missing.length > 0) {
      toast({ title: t("questionnaire.requiredError"), description: t("questionnaire.fillRequired"), variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const payloadAnswers = { ...answers };
      if (attachmentFiles.length > 0) {
        (payloadAnswers as Record<string, unknown>)._attachments = attachmentFiles;
      }
      await apiRequest("POST", "/api/contact", {
        ...draft,
        questionnaireAnswers: payloadAnswers,
      });
      sessionStorage.removeItem(CONTACT_DRAFT_KEY);
      sessionStorage.removeItem(CONTACT_FOR_AI_KEY);
      toast({ title: t("contact.success"), description: t("contact.successDesc") });
      setLocation("/contact");
    } catch {
      toast({ title: t("contact.error"), description: t("contact.errorDesc"), variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleContinueToAi = () => {
    try {
      const payloadAnswers = { ...answers };
      if (attachmentFiles.length > 0) {
        (payloadAnswers as Record<string, unknown>)._attachments = attachmentFiles;
      }
      sessionStorage.setItem(CONTACT_FOR_AI_KEY, JSON.stringify({ draft, questionnaireAnswers: payloadAnswers }));
      setLocation("/contact/ai-chat");
    } catch {
      toast({ title: t("contact.error"), description: t("contact.errorDesc"), variant: "destructive" });
    }
  };

  return (
    <PageWrapper>
      <SEOHead title="Contact Questionnaire" path="/contact/questionnaire" />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section id="main-content" className="pt-32 pb-24 sm:pt-40 sm:pb-32 relative">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-400 hover:text-white mb-8 -ml-2"
              onClick={() => setLocation("/contact")}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t("questionnaire.back")}
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-md p-6 sm:p-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
                <p className="text-neon-cyan text-sm font-medium uppercase tracking-widest mb-0">
                  {t("questionnaire.service_label")}
                </p>
                <div className="flex gap-2" role="group" aria-label="Questionnaire language">
                  <button
                    type="button"
                    onClick={() => setLang("en")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      lang === "en"
                        ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                        : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08]"
                    }`}
                  >
                    {t("questionnaire.viewInEnglish")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang("he")}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      lang === "he"
                        ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40"
                        : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08]"
                    }`}
                  >
                    {t("questionnaire.translateToHebrew")}
                  </button>
                </div>
              </div>
              <p className="text-xl font-semibold text-white mb-2">
                {t(serviceLabelKey)}
              </p>

              <h2 className="text-lg text-slate-300 mb-6">{t("questionnaire.title")}</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {questions.map((q) => (
                  <QuestionField
                    key={q.id}
                    question={q}
                    value={answers[q.id] ?? ""}
                    onChange={(v) => handleChange(q.id, v)}
                    t={t}
                    required={q.required}
                  />
                ))}

                <div>
                  <label className="block text-sm text-slate-300 mb-2">{t("questionnaire.uploadFiles")}</label>
                  <p className="text-xs text-slate-500 mb-2">{t("questionnaire.uploadFilesHint")}</p>
                  <div className="flex flex-wrap gap-2">
                    {attachmentFiles.map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] border border-white/[0.08] px-2 py-1 text-xs text-slate-300"
                      >
                        {f.name}
                        <button
                          type="button"
                          onClick={() => setAttachmentFiles((prev) => prev.filter((_, j) => j !== i))}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    <label className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-white/[0.2] px-3 py-2 text-sm text-slate-400 hover:text-white hover:border-neon-cyan/50 cursor-pointer">
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
                <p className="text-center text-slate-400 text-sm">{t("questionnaire.or")}</p>
                <Button
                  type="button"
                  variant="outline"
                  disabled={sending}
                  onClick={handleContinueToAi}
                  className="w-full border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
                >
                  {t("questionnaire.continueToAi")}
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
    <label className="block text-sm text-slate-300 mb-2">
      {label}
      {required && <span className="text-red-400 ml-0.5" aria-hidden>*</span>}
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
          className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50 resize-none"
        />
      </div>
    );
  }

  if (question.type === "select") {
    return (
      <div>
        {labelEl}
        <Select value={value || undefined} onValueChange={onChange}>
          <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {(question.options ?? []).map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="focus:bg-white/10 focus:text-white">
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
              <span className="text-white text-sm">{t(opt.labelKey)}</span>
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
        className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
      />
    </div>
  );
}
