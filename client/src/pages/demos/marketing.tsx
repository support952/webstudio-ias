import { ProductExplanationPage } from "@/components/product-explanation-page";
import { SEOHead } from "@/components/seo-head";

export default function DemoMarketing() {
  return (
    <>
      <SEOHead title="Marketing Demo" path="/demos/marketing" />
      <ProductExplanationPage productId="marketing" />
    </>
  );
}
