import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, Send, User, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";
import type { InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CONTACT_FOR_AI_KEY = "contact_for_ai";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageDataUrl?: string;
}

interface ContactForAi {
  draft: InsertContact;
  questionnaireAnswers: Record<string, string>;
}

export default function ContactAIChat() {
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { toast } = useToast();
  const [data, setData] = useState<ContactForAi | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [summaryDone, setSummaryDone] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialSentRef = useRef(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CONTACT_FOR_AI_KEY);
      if (!raw) {
        setLocation("/contact/questionnaire");
        return;
      }
      const parsed = JSON.parse(raw) as ContactForAi;
      if (!parsed?.draft || !parsed?.questionnaireAnswers) {
        setLocation("/contact/questionnaire");
        return;
      }
      setData(parsed);
    } catch {
      setLocation("/contact/questionnaire");
    }
  }, [setLocation]);

  useEffect(() => {
    if (data && messages.length === 0 && !loading && !initialSentRef.current) {
      initialSentRef.current = true;
      sendInitialGreeting();
    }
  }, [data]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function cleanReply(reply: string): string {
    if (reply.includes("---SUMMARY---")) {
      setSummaryDone(true);
      return reply.split("---SUMMARY---")[0].trim() || t("aiChat.thankYou");
    }
    return reply;
  }

  async function sendInitialGreeting() {
    if (!data) return;
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/ai-chat", {
        messages: [],
        clientInfo: { name: data.draft.name, email: data.draft.email },
        questionnaireContext: data.questionnaireAnswers,
        productType: data.draft.service,
      });
      const body = await res.json();
      setMessages([{ role: "assistant", content: cleanReply(body.reply ?? t("aiChat.errorMsg")) }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      const serverMsg = msg.startsWith("503:") || msg.startsWith("500:")
        ? (() => {
            try {
              const json = JSON.parse(msg.replace(/^\d+:\s*/, ""));
              return json.message || t("aiChat.errorMsg");
            } catch {
              return t("aiChat.errorMsg");
            }
          })()
        : t("aiChat.errorMsg");
      setMessages([{ role: "assistant", content: serverMsg }]);
    }
    setLoading(false);
  }

  async function handleSend() {
    if (!data || (!input.trim() && !pendingImage) || loading || summaryDone) return;

    const userMsg: Message = { role: "user", content: input.trim() || "(תמונה)", imageDataUrl: pendingImage || undefined };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setPendingImage(null);
    setLoading(true);

    try {
      const apiMessages = newMessages.map((m) => {
        if (m.role === "assistant") return { role: "assistant" as const, content: m.content };
        if (m.imageDataUrl)
          return {
            role: "user" as const,
            content: [
              { type: "text" as const, text: m.content === "(תמונה)" ? "" : m.content },
              { type: "image_url" as const, image_url: { url: m.imageDataUrl } },
            ],
          };
        return { role: "user" as const, content: m.content };
      });
      const res = await apiRequest("POST", "/api/ai-chat", {
        messages: apiMessages,
        clientInfo: { name: data.draft.name, email: data.draft.email },
        questionnaireContext: data.questionnaireAnswers,
        productType: data.draft.service,
      });
      const body = await res.json();
      setMessages([...newMessages, { role: "assistant", content: cleanReply(body.reply ?? t("aiChat.errorMsg")) }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      let serverMsg = t("aiChat.errorMsg");
      if (msg.startsWith("503:") || msg.startsWith("500:")) {
        try {
          const json = JSON.parse(msg.replace(/^\d+:\s*/, ""));
          serverMsg = json.message || serverMsg;
        } catch {
          /* use default */
        }
      }
      setMessages([...newMessages, { role: "assistant", content: serverMsg }]);
    }
    setLoading(false);
  }

  async function handleFinish() {
    if (!data) return;
    setFinishing(true);
    try {
      const chatTranscript = messages.length > 0 ? messages : undefined;
      await apiRequest("POST", "/api/contact", {
        ...data.draft,
        questionnaireAnswers: data.questionnaireAnswers,
        chatTranscript,
      });
      sessionStorage.removeItem(CONTACT_FOR_AI_KEY);
      sessionStorage.removeItem("contact_draft");
      toast({ title: t("contact.success"), description: t("contact.successDesc") });
      setLocation("/contact");
    } catch {
      toast({ title: t("contact.error"), description: t("contact.errorDesc"), variant: "destructive" });
    } finally {
      setFinishing(false);
    }
  }

  if (!data) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <span className="text-slate-400">...</span>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <SEOHead title="Contact AI Chat" path="/contact/ai-chat" />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section id="main-content" className="pt-32 pb-24 sm:pt-40 sm:pb-32 relative">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-400 hover:text-white mb-6 -ml-2"
              onClick={() => setLocation("/contact/questionnaire")}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t("questionnaire.back")}
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-md flex flex-col overflow-hidden"
              style={{ minHeight: "420px" }}
            >
              <div className="flex items-center justify-between gap-2 p-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white font-semibold text-lg shrink-0" aria-hidden>
                    J
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">{t("aiChat.agentName")}</h2>
                    <p className="text-xs text-slate-400">{t("aiChatStep.subtitle")}</p>
                  </div>
                </div>
              </div>
              <p className="px-4 py-2 text-xs text-slate-400 border-b border-white/[0.06] bg-white/[0.02]" role="status">
                {t("aiChat.multilingualNotice")}
              </p>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px]">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5" aria-hidden>
                        J
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-neon-purple/20 text-white"
                          : "bg-white/[0.05] text-slate-200"
                      }`}
                    >
                      {msg.content}
                      {msg.imageDataUrl && (
                        <div className="mt-2">
                          <img src={msg.imageDataUrl} alt="" className="max-w-full max-h-40 rounded object-contain" />
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-md bg-neon-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-neon-cyan" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      J
                    </div>
                    <div className="bg-white/[0.05] rounded-md px-3 py-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {summaryDone && (
                  <div className="text-center py-2">
                    <p className="text-sm text-neon-cyan">{t("aiChat.summaryDone")}</p>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-white/[0.08] space-y-3">
                {pendingImage && (
                  <div className="flex items-center gap-2">
                    <img src={pendingImage} alt="" className="h-12 w-12 rounded object-cover" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => setPendingImage(null)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <label className="shrink-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f && f.type.startsWith("image/")) {
                          const r = new FileReader();
                          r.onload = () => setPendingImage(String(r.result));
                          r.readAsDataURL(f);
                        }
                        e.target.value = "";
                      }}
                    />
                    <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:border-neon-purple/50">
                      <ImagePlus className="w-5 h-5" />
                    </span>
                  </label>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={summaryDone ? t("aiChat.chatEnded") : t("aiChat.placeholder")}
                    disabled={loading || summaryDone}
                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={loading || summaryDone || (!input.trim() && !pendingImage)}
                    className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <Button
                  type="button"
                  onClick={handleFinish}
                  disabled={finishing}
                  variant="outline"
                  className="w-full border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
                >
                  {finishing ? t("questionnaire.sending") : t("aiChatStep.finish")}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}
