import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiChatModalProps {
  open: boolean;
  onClose: () => void;
  clientInfo: { name?: string; email?: string };
}

export function AiChatModal({ open, onClose, clientInfo }: AiChatModalProps) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryDone, setSummaryDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      sendInitialGreeting();
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && !loading) {
      inputRef.current?.focus();
    }
  }, [open, loading, messages]);

  async function sendInitialGreeting() {
    setLoading(true);
    try {
      const greeting: Message = {
        role: "user",
        content: `Hi, my name is ${clientInfo.name || "there"}. I just submitted a contact form and I'm interested in your services.`,
      };

      const res = await apiRequest("POST", "/api/ai-chat", {
        messages: [greeting],
        clientInfo,
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: cleanReply(data.reply) }]);
    } catch {
      setMessages([{ role: "assistant", content: t("aiChat.errorMsg") }]);
    }
    setLoading(false);
  }

  function cleanReply(reply: string): string {
    if (reply.includes("---SUMMARY---")) {
      setSummaryDone(true);
      return reply.split("---SUMMARY---")[0].trim() || t("aiChat.thankYou");
    }
    return reply;
  }

  async function handleSend() {
    if (!input.trim() || loading || summaryDone) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await apiRequest("POST", "/api/ai-chat", {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        clientInfo,
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: cleanReply(data.reply) }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: t("aiChat.errorMsg") }]);
    }
    setLoading(false);
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        data-testid="modal-ai-chat"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg glass-card living-shadow rounded-2xl flex flex-col overflow-hidden border border-white/[0.08]"
          style={{ maxHeight: "80vh" }}
        >
          <div className="flex items-center justify-between gap-2 p-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white font-semibold text-sm shrink-0" aria-hidden>
                J
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white" data-testid="text-ai-chat-title">{t("aiChat.agentName")}</h3>
                <p className="text-xs text-muted-foreground">{t("aiChat.subtitle")}</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground"
              data-testid="button-close-ai-chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground px-4 pb-2 border-b border-border">{t("aiChat.multilingualNotice")}</p>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${msg.role}-${i}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white font-semibold text-xs shrink-0 mt-0.5" aria-hidden>
                    J
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-md px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-neon-purple/20 text-white"
                      : "bg-white/[0.05] text-slate-200"
                  }`}
                >
                  {msg.content}
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
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white font-semibold text-xs shrink-0" aria-hidden>
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
              <div className="text-center py-3">
                <p className="text-sm text-neon-cyan">{t("aiChat.summaryDone")}</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/[0.08]">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={summaryDone ? t("aiChat.chatEnded") : t("aiChat.placeholder")}
                disabled={loading || summaryDone}
                className="bg-background/80 border-border text-foreground placeholder-contrast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary"
                data-testid="input-ai-chat"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || summaryDone || !input.trim()}
                className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate shrink-0"
                data-testid="button-send-ai-chat"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
