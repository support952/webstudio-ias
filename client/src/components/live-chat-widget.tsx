"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, User, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Language } from "@/lib/i18n";
import { OPEN_LIVE_CHAT_EVENT } from "@/lib/live-chat-events";

const FAQ_KEYS = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
] as const;

const LANG_TO_HINT: Record<Language, string> = {
  en: "English",
  de: "German",
  es: "Spanish",
  fr: "French",
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/** Re-export so existing `import { openLiveChat } from "@/components/live-chat-widget"` keeps working. Prefer `@/lib/live-chat-events` for smaller bundles. */
export { openLiveChat } from "@/lib/live-chat-events";

export function LiveChatWidget() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open && !typing) {
      inputRef.current?.focus();
    }
  }, [open, typing]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_LIVE_CHAT_EVENT, handler);
    return () => window.removeEventListener(OPEN_LIVE_CHAT_EVENT, handler);
  }, []);

  async function sendToAi(userMsg: ChatMessage): Promise<string> {
    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const res = await apiRequest("POST", "/api/ai-chat", {
      messages: apiMessages,
      liveChat: true,
      preferredLanguage: LANG_TO_HINT[lang],
    });
    const data = await res.json();
    return data.reply ?? "";
  }

  function addAssistantMessage(content: string) {
    setMessages((prev) => [
      ...prev,
      { id: `assistant-${Date.now()}`, role: "assistant", content },
    ]);
  }

  async function handleAiReply(userMsg: ChatMessage, fallbackAnswer: string) {
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    try {
      const reply = await sendToAi(userMsg);
      const text = (reply && reply.trim()) || fallbackAnswer;
      addAssistantMessage(text);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const fallback = msg.includes("503") ? t("liveChatWidget.unavailable") : fallbackAnswer;
      addAssistantMessage(fallback);
    } finally {
      setTyping(false);
    }
  }

  const handleQuestionClick = (qKey: string, aKey: string) => {
    const question = t(qKey);
    const fallbackAnswer = t(aKey);
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: question };
    handleAiReply(userMsg, fallbackAnswer);
  };

  const handleSendTyped = async () => {
    const text = inputValue.trim();
    if (!text || typing) return;

    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: "user", content: text };
    setInputValue("");
    const fallbackAnswer = t("liveChatWidget.noMatch");
    await handleAiReply(userMsg, fallbackAnswer);
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/16722245167", "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const handlePanelWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            aria-hidden
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed z-50 flex flex-col items-end gap-0 bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] end-[max(1rem,env(safe-area-inset-right,0px))] sm:end-[max(1.5rem,env(safe-area-inset-right,0px))]">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mb-3 w-[min(100vw-2rem,380px)] sm:w-[380px] rounded-2xl border border-border bg-card shadow-xl overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[85vh]"
              data-testid="live-chat-panel"
              onWheel={handlePanelWheel}
            >
              <div className="flex items-center justify-between gap-2 p-4 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{t("contact.liveChat")}</h3>
                    <p className="text-xs text-muted-foreground">{t("liveChatWidget.aiSubtitle")}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-3 bg-muted/20 overscroll-contain"
                style={{ overscrollBehavior: "contain" }}
              >
                {messages.length === 0 && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
                      W
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-md px-4 py-3 text-sm text-foreground bg-card border border-border shadow-sm">
                      {t("liveChatWidget.greeting")}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5">
                        W
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-tr-md bg-gradient-to-r from-neon-purple/20 to-neon-cyan/10 text-foreground border border-primary/20"
                          : "rounded-tl-md bg-card text-foreground border border-border shadow-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {typing && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white text-xs font-semibold shrink-0 mt-0.5" />
                    <div className="rounded-2xl rounded-tl-md px-4 py-3 bg-card border border-border">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                    {t("liveChatWidget.quickQuestions")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {FAQ_KEYS.map(({ q, a }) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleQuestionClick(q, a)}
                        disabled={typing}
                        className="text-start text-xs px-3 py-2 rounded-xl bg-card border border-border text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors disabled:opacity-60"
                      >
                        {t(q)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 border-t border-border bg-card shrink-0 space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendTyped();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t("liveChatWidget.placeholder")}
                    disabled={typing}
                    className="flex-1 h-10 rounded-xl bg-background/80 border-border text-foreground"
                    data-testid="live-chat-input"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={typing || !inputValue.trim()}
                    className="h-10 w-10 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 shrink-0"
                    data-testid="live-chat-send"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.129 6.744 3.047 9.381L1.054 31.2l6.023-1.937A15.89 15.89 0 0 0 16.004 32C24.826 32 32 24.822 32 16.004 32 7.176 24.826 0 16.004 0zm9.302 22.602c-.388 1.094-1.937 2.003-3.14 2.267-.825.177-1.9.318-5.524-1.188-4.637-1.926-7.623-6.627-7.856-6.934-.222-.307-1.87-2.49-1.87-4.749 0-2.26 1.183-3.37 1.604-3.83.388-.425 1.03-.615 1.645-.615.198 0 .376.01.536.018.46.02.691.047.994.768.378.9 1.3 3.168 1.412 3.4.115.231.222.536.075.843-.14.314-.264.454-.496.72-.231.264-.45.467-.682.752-.214.248-.454.513-.19.979.264.46 1.175 1.937 2.523 3.138 1.733 1.543 3.193 2.023 3.647 2.247.348.173.762.14.999-.107.222-.29.498-.772.779-1.249.198-.34.45-.38.758-.264.314.107 1.987.937 2.327 1.107.34.173.567.26.649.404.08.14.08.825-.307 1.919z"/></svg>
                  {t("liveChatWidget.needMore")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-transform"
          aria-label={open ? "Close chat" : "Open live chat"}
          data-testid="live-chat-toggle"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </div>
    </>
  );
}
