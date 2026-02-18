import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, Eye, EyeOff, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Register() {
  const { t } = useI18n();
  const { register } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !username || !email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      toast({ title: t("auth.passwordMismatch"), variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      toast({ title: t("auth.passwordTooShort"), variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await register({ fullName, username, email, password });
      toast({ title: t("auth.registerSuccess") });
      setLocation("/");
    } catch (err: any) {
      const msg = err?.message || t("auth.registerError");
      toast({ title: msg, variant: "destructive" });
    }
    setLoading(false);
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section className="relative pt-32 pb-20 px-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-md mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-white mb-2" data-testid="text-register-title">
                {t("auth.registerTitle")}
              </h1>
              <p className="text-slate-400" data-testid="text-register-subtitle">
                {t("auth.registerSubtitle")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card rounded-md p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">{t("auth.fullName")}</label>
                  <div className="relative">
                    <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t("auth.fullNamePlaceholder")}
                      className="ps-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                      data-testid="input-register-fullname"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">{t("auth.username")}</label>
                  <div className="relative">
                    <AtSign className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t("auth.usernamePlaceholder")}
                      className="ps-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                      data-testid="input-register-username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">{t("auth.email")}</label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("auth.emailPlaceholder")}
                      className="ps-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                      data-testid="input-register-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">{t("auth.password")}</label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("auth.passwordPlaceholder")}
                      className="ps-10 pe-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                      data-testid="input-register-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">{t("auth.confirmPassword")}</label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t("auth.confirmPasswordPlaceholder")}
                      className="ps-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-neon-purple/50"
                      data-testid="input-register-confirm-password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !fullName || !username || !email || !password || !confirmPassword}
                  className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 no-default-hover-elevate no-default-active-elevate"
                  data-testid="button-register-submit"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("auth.registering")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      {t("auth.register")}
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  {t("auth.hasAccount")}{" "}
                  <Link href="/login" className="text-neon-purple hover:text-neon-cyan transition-colors" data-testid="link-go-login">
                    {t("auth.loginLink")}
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </PageWrapper>
  );
}
