import { useEffect, lazy, Suspense } from "react";
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

// Lazy-loaded page components for code splitting
const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/home"));
const Services = lazy(() => import("@/pages/services"));
const About = lazy(() => import("@/pages/about"));
const Work = lazy(() => import("@/pages/work"));
const Pricing = lazy(() => import("@/pages/pricing"));
const Contact = lazy(() => import("@/pages/contact"));
const ContactQuestionnaire = lazy(() => import("@/pages/contact-questionnaire"));
const ContactAIChat = lazy(() => import("@/pages/contact-ai-chat"));
const Checkout = lazy(() => import("@/pages/checkout"));
const Marketing = lazy(() => import("@/pages/marketing"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const RefundPolicy = lazy(() => import("@/pages/refund-policy"));
const TermsOfService = lazy(() => import("@/pages/terms-of-service"));
const CookiePolicy = lazy(() => import("@/pages/cookie-policy"));
const SitemapPage = lazy(() => import("@/pages/sitemap"));
const ComingSoon = lazy(() => import("@/pages/coming-soon"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const AdminPanel = lazy(() => import("@/pages/admin-panel"));
const DemoDigitalCard = lazy(() => import("@/pages/demos/digital-card"));
const DemoLanding = lazy(() => import("@/pages/demos/landing"));
const DemoEcommerce = lazy(() => import("@/pages/demos/ecommerce"));
const DemoWebsites = lazy(() => import("@/pages/demos/websites"));
const DemoMarketing = lazy(() => import("@/pages/demos/marketing"));
const PreviewLanding = lazy(() => import("@/pages/preview/landing"));
const PreviewWebsites = lazy(() => import("@/pages/preview/websites"));
const PreviewDigitalCard = lazy(() => import("@/pages/preview/digital-card"));
const PreviewMarketing = lazy(() => import("@/pages/preview/marketing"));

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

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="page-loader-bolt">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-20 h-20 sm:w-28 sm:h-28 text-primary"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
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
