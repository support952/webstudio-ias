import { ProductExplanationPage } from "@/components/product-explanation-page";
import { SEOHead } from "@/components/seo-head";

export default function DemoLanding() {
  return (
    <>
      <SEOHead title="Landing Page Demo" path="/demos/landing" />
      <ProductExplanationPage productId="landing" />
    </>
  );
}
