import { useState } from "react";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ComingSoon() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
      setEmail("");
      toast({ title: t("comingSoon.notifySuccess") });
    } catch {
      toast({ title: "Something went wrong.", variant: "destructive" });
    }
    setLoading(false);
  }

  return (
    <PageWrapper>
      <SEOHead title="Coming Soon" path="/coming-soon" />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <main id="main-content" className="pt-32 pb-16 sm:pt-40 sm:pb-20 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-lg mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-md p-8 sm:p-12"
            >
              <div className="w-16 h-16 rounded-full bg-neon-cyan/10 flex items-center justify-center mx-auto mb-6">
                <Construction className="w-8 h-8 text-neon-cyan" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3" data-testid="text-coming-soon-title">
                {t("comingSoon.title")}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mb-6">
                {t("comingSoon.subtitle")}
              </p>

              {!submitted && (
                <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2 mb-6 max-w-sm mx-auto">
                  <label htmlFor="coming-soon-email" className="sr-only">{t("comingSoon.notifyLabel")}</label>
                  <Input
                    id="coming-soon-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("comingSoon.notifyPlaceholder")}
                    className="flex-1 bg-white/[0.03] border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                  <Button type="submit" disabled={loading} className="bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 shrink-0">
                    {loading ? "..." : t("comingSoon.notifyButton")}
                  </Button>
                </form>
              )}

              <Link href="/contact">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  {t("comingSoon.cta")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
