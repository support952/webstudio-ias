import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { TrustSection } from "@/components/trust-section";
import { ServicesOverview } from "@/components/services-overview";
import { Footer } from "@/components/footer";
import { PageWrapper } from "@/components/page-wrapper";

export default function Home() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <HeroSection />
        <TrustSection />
        <ServicesOverview />
        <Footer />
      </div>
    </PageWrapper>
  );
}
