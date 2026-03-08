import { ProductExplanationPage } from "@/components/product-explanation-page";
import { SEOHead } from "@/components/seo-head";

export default function DemoWebsites() {
  return (
    <>
      <SEOHead title="Websites Demo" path="/demos/websites" />
      <ProductExplanationPage productId="websites" />
    </>
  );
}
