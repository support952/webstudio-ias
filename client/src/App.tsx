import { useEffect, useState, lazy, Suspense } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { LenisProvider, useLenis } from "@/lib/lenis";
import { AuthProvider, useAuth } from "@/lib/auth";
import { LazyMotion, domAnimation } from "framer-motion";
import { ErrorBoundary } from "@/components/error-boundary";
import { WhatsAppBubble } from "@/components/whatsapp-bubble";

// Defer non-critical visual elements
const FlowLine = lazy(() => import("@/components/flow-line").then((m) => ({ default: m.FlowLine })));
const ScrollProgress = lazy(() => import("@/components/scroll-progress").then((m) => ({ default: m.ScrollProgress })));

const LiveChatWidgetLazy = lazy(() =>
  import("@/components/live-chat-widget").then((m) => ({ default: m.LiveChatWidget })),
);

function DeferredLiveChatWidget() {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const idleId = w.requestIdleCallback(() => setMount(true), { timeout: 2800 });
      return () => w.cancelIdleCallback?.(idleId);
    }
    const timeoutId = window.setTimeout(() => setMount(true), 1800);
    return () => clearTimeout(timeoutId);
  }, []);
  if (!mount) return null;
  return (
    <Suspense fallback={null}>
      <LiveChatWidgetLazy />
    </Suspense>
  );
}

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
const StandaloneQuestionnaire = lazy(() => import("@/pages/standalone-questionnaire"));
const Checkout = lazy(() => import("@/pages/checkout"));
const Marketing = lazy(() => import("@/pages/marketing"));
const Products = lazy(() => import("@/pages/products"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsOfService = lazy(() => import("@/pages/terms-of-service"));
const CookiePolicy = lazy(() => import("@/pages/cookie-policy"));
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
  if (!user) return <Redirect to="/" />;
  return <Component />;
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/">{() => <HomeOrDashboard />}</Route>
        <Route path="/services">{() => <AuthRedirect component={Services} />}</Route>
        <Route path="/about">{() => <AuthRedirect component={About} />}</Route>
        <Route path="/work">{() => <AuthRedirect component={Work} />}</Route>
        <Route path="/pricing">{() => <AuthRedirect component={Pricing} />}</Route>
        <Route path="/questionnaire" component={StandaloneQuestionnaire} />
        <Route path="/contact/questionnaire">{() => <AuthRedirect component={ContactQuestionnaire} />}</Route>
        <Route path="/contact/ai-chat">{() => <AuthRedirect component={ContactAIChat} />}</Route>
        <Route path="/contact">{() => <AuthRedirect component={Contact} />}</Route>
        <Route path="/checkout">{() => <AuthRedirect component={Checkout} />}</Route>
        <Route path="/marketing">{() => <AuthRedirect component={Marketing} />}</Route>
        <Route path="/products">{() => <AuthRedirect component={Products} />}</Route>
        <Route path="/demos/digital-card" component={DemoDigitalCard} />
        <Route path="/demos/landing" component={DemoLanding} />
        <Route path="/demos/ecommerce" component={DemoEcommerce} />
        <Route path="/demos/websites" component={DemoWebsites} />
        <Route path="/demos/marketing" component={DemoMarketing} />
        <Route path="/preview/landing" component={PreviewLanding} />
        <Route path="/preview/websites" component={PreviewWebsites} />
        <Route path="/preview/digital-card" component={PreviewDigitalCard} />
        <Route path="/preview/marketing" component={PreviewMarketing} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/coming-soon" component={ComingSoon} />
        <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
        <Route path="/dashboard/:tab">{() => <ProtectedRoute component={Dashboard} />}</Route>
        <Route path="/admin" component={AdminPanel} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <LazyMotion features={domAnimation}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
              <LenisProvider>
                <div className="site-canvas" aria-hidden />
                <Suspense fallback={null}><ScrollProgress /></Suspense>
                <Suspense fallback={null}><FlowLine /></Suspense>
                <div className="relative z-10 min-h-screen min-h-full" data-unified-canvas>
                  <ScrollToTop />
                  <Toaster />
                  <Router />
                  <DeferredLiveChatWidget />
                  <WhatsAppBubble />
                </div>
              </LenisProvider>
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
    </LazyMotion>
  );
}

export default App;
