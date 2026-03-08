import { useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import { LenisProvider, useLenis } from "@/lib/lenis";
import { AuthProvider, useAuth } from "@/lib/auth";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Services from "@/pages/services";
import About from "@/pages/about";
import Work from "@/pages/work";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
import ContactQuestionnaire from "@/pages/contact-questionnaire";
import ContactAIChat from "@/pages/contact-ai-chat";
import Checkout from "@/pages/checkout";
import Marketing from "@/pages/marketing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import PrivacyPolicy from "@/pages/privacy-policy";
import RefundPolicy from "@/pages/refund-policy";
import TermsOfService from "@/pages/terms-of-service";
import CookiePolicy from "@/pages/cookie-policy";
import SitemapPage from "@/pages/sitemap";
import ComingSoon from "@/pages/coming-soon";
import Dashboard from "@/pages/dashboard";
import AdminPanel from "@/pages/admin-panel";
import DemoDigitalCard from "@/pages/demos/digital-card";
import DemoLanding from "@/pages/demos/landing";
import DemoEcommerce from "@/pages/demos/ecommerce";
import DemoWebsites from "@/pages/demos/websites";
import DemoMarketing from "@/pages/demos/marketing";
import PreviewLanding from "@/pages/preview/landing";
import PreviewWebsites from "@/pages/preview/websites";
import PreviewDigitalCard from "@/pages/preview/digital-card";
import PreviewMarketing from "@/pages/preview/marketing";

function ScrollToTop() {
  const [location] = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, lenis]);
  return null;
}

function HomeOrDashboard() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Redirect to="/dashboard" />;
  return <Home />;
}

function AuthRedirect({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Redirect to="/dashboard" />;
  return <Component />;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Redirect to="/login" />;
  return <Component />;
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/">{() => <HomeOrDashboard />}</Route>
        <Route path="/services">{() => <AuthRedirect component={Services} />}</Route>
        <Route path="/about">{() => <AuthRedirect component={About} />}</Route>
        <Route path="/work">{() => <AuthRedirect component={Work} />}</Route>
        <Route path="/pricing">{() => <AuthRedirect component={Pricing} />}</Route>
        <Route path="/contact/questionnaire">{() => <AuthRedirect component={ContactQuestionnaire} />}</Route>
        <Route path="/contact/ai-chat">{() => <AuthRedirect component={ContactAIChat} />}</Route>
        <Route path="/contact">{() => <AuthRedirect component={Contact} />}</Route>
        <Route path="/checkout">{() => <AuthRedirect component={Checkout} />}</Route>
        <Route path="/marketing">{() => <AuthRedirect component={Marketing} />}</Route>
        <Route path="/demos/digital-card" component={DemoDigitalCard} />
        <Route path="/demos/landing" component={DemoLanding} />
        <Route path="/demos/ecommerce" component={DemoEcommerce} />
        <Route path="/demos/websites" component={DemoWebsites} />
        <Route path="/demos/marketing" component={DemoMarketing} />
        <Route path="/preview/landing" component={PreviewLanding} />
        <Route path="/preview/websites" component={PreviewWebsites} />
        <Route path="/preview/digital-card" component={PreviewDigitalCard} />
        <Route path="/preview/marketing" component={PreviewMarketing} />
        <Route path="/login">{() => <AuthRedirect component={Login} />}</Route>
        <Route path="/register">{() => <AuthRedirect component={Register} />}</Route>
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/refund-policy" component={RefundPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/sitemap" component={SitemapPage} />
        <Route path="/coming-soon" component={ComingSoon} />
        <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
        <Route path="/dashboard/:tab">{() => <ProtectedRoute component={Dashboard} />}</Route>
        <Route path="/ws-panel-9x7k" component={AdminPanel} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
<I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <LenisProvider>
              <div className="site-canvas" aria-hidden />
              <div className="relative z-10 min-h-screen min-h-full" data-unified-canvas>
                <ScrollToTop />
                <Toaster />
                <Router />
              </div>
            </LenisProvider>
          </AuthProvider>
        </ThemeProvider>
        </I18nProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
