import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { t } = useI18n();
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await login(email, password);
      toast({ title: t("auth.loginSuccess") });
      setLocation("/dashboard");
    } catch (err: any) {
      const msg = err?.message || t("auth.loginError");
      toast({ title: msg, variant: "destructive" });
    }
    setLoading(false);
  }

  return (
    <PageWrapper>
      <SEOHead title="Login" path="/login" />
      <div className="min-h-screen text-foreground font-sans antialiased">
        <Navbar />

        <main id="main-content">
          <section className="relative pt-safe-md pb-20 px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 start-1/4 w-80 h-80 bg-neon-purple/12 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 end-1/4 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-md mx-auto relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-10"
              >
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-2" data-testid="text-login-title">
                  {t("auth.loginTitle")}
                </h1>
                <div className="w-10 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto mb-3" />
                <p className="text-muted-foreground text-sm" data-testid="text-login-subtitle">
                  {t("auth.loginSubtitle")}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="rounded-2xl border border-border bg-card/80 p-6 sm:p-8 transition-all duration-300 shadow-xl shadow-black/5"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-sm text-muted-foreground mb-1.5">{t("auth.email")}</label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("auth.emailPlaceholder")}
                      className="ps-10 bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      data-testid="input-login-email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm text-muted-foreground mb-1.5">{t("auth.password")}</label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("auth.passwordPlaceholder")}
                      className="ps-10 pe-10 bg-background/80 border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                      data-testid="input-login-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Toggle password visibility"
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="link-forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 py-6 text-sm font-medium shadow-lg hover:shadow-xl transition-shadow"
                  data-testid="button-login-submit"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("auth.loggingIn")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      {t("auth.login")}
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {t("auth.noAccount")}{" "}
                  <Link href="/register" className="text-neon-purple hover:text-neon-cyan transition-colors" data-testid="link-go-register">
                    {t("auth.registerLink")}
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
