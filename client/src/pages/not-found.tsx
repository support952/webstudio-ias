import { Link } from "wouter";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";
import { SEOHead } from "@/components/seo-head";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <PageWrapper>
      <SEOHead title="Page Not Found" path="/404" />
      <div className="min-h-screen w-full flex flex-col bg-background text-foreground font-sans antialiased">
        <Navbar />
        <main id="main-content" className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
          <div className="w-full max-w-md flex flex-col items-center text-center">
            <Logo href="/" variant="dark" className="mb-8" />
            <div className="w-full rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-xl">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  <AlertCircle className="h-7 w-7 text-rose-400" aria-hidden />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-2">404</h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                Page not found. The link may be broken or the page was moved.
              </p>
              <Link href="/">
                <Button className="rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 px-6 py-5 text-sm font-medium shadow-lg hover:shadow-xl transition-shadow">
                  <Home className="w-4 h-4 me-2" aria-hidden />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageWrapper>
  );
}
