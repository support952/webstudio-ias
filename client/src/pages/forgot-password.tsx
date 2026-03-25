import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      // Placeholder: in production you would call an API to send reset email
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
      toast({ title: "If an account exists for this email, we've sent password reset instructions." });
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    }
    setLoading(false);
  }

  return (
    <PageWrapper>
      <SEOHead title="Forgot Password" path="/forgot-password" />
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
                className="rounded-2xl border border-border bg-card/80 p-6 sm:p-8"
              >
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
                <h1 className="text-2xl font-semibold text-foreground mb-2">Forgot Password?</h1>
                <p className="text-muted-foreground text-sm mb-6">
                  Enter your email and we'll send you instructions to reset your password.
                </p>

                {submitted ? (
                  <p className="text-foreground text-sm py-4">
                    Check your inbox. If an account exists for that email, you'll receive reset instructions shortly.
                  </p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="forgot-email" className="form-label block text-sm mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="forgot-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="ps-10 bg-background/80 border-border text-foreground placeholder:text-muted-foreground"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || !email}
                      className="w-full rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 py-6"
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageWrapper>
  );
}
