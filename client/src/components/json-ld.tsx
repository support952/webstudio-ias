import { useMemo } from "react";

const SITE_URL = "https://webstudio-ias.com";
const LOGO_URL = `${SITE_URL}/favicon.png`;

export function OrganizationJsonLd() {
  const json = useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "WebStudio",
        url: SITE_URL,
        logo: LOGO_URL,
        description:
          "We craft cutting-edge digital experiences that elevate your brand, drive growth, and push the boundaries of what's possible on the web.",
        contactPoint: {
          "@type": "ContactPoint",
          email: "support@webstudio-ias.com",
          contactType: "customer service",
        },
        sameAs: [
          "https://www.linkedin.com/company/webstudio-ias",
          "https://twitter.com/webstudio_ias",
          "https://www.instagram.com/webstudio_ias",
          "https://www.facebook.com/webstudio.ias",
        ],
      }),
    []
  );
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}

export function ServiceJsonLd() {
  const json = useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Web Development & Digital Agency Services",
        description:
          "Custom web development, AI automation, UI/UX design, and digital marketing solutions for businesses.",
        provider: {
          "@type": "Organization",
          name: "WebStudio",
          url: SITE_URL,
        },
        areaServed: "Worldwide",
      }),
    []
  );
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}

export function ContactPageJsonLd() {
  const json = useMemo(
    () =>
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact WebStudio",
        description: "Get in touch with WebStudio for web development, design, and digital marketing services.",
        url: `${SITE_URL}/contact`,
        mainEntity: {
          "@type": "Organization",
          name: "WebStudio",
          email: "support@webstudio-ias.com",
          url: SITE_URL,
        },
      }),
    []
  );
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
