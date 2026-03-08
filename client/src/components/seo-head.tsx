import { useEffect } from "react";

const SITE_URL = "https://webstudio-ias.com";
const DEFAULT_IMAGE = `${SITE_URL}/favicon.png`;

export interface SEOHeadProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SEOHead({ title, description, path = "", image = DEFAULT_IMAGE }: SEOHeadProps) {
  const fullTitle = title.includes("|") ? title : `${title} | WebStudio`;
  const url = path ? `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}` : SITE_URL + "/";
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  useEffect(() => {
    document.title = fullTitle;

    setMeta("description", description ?? "We craft cutting-edge digital experiences that elevate your brand, drive growth, and push the boundaries of what's possible on the web.");
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description ?? "Custom web development, AI automation, UI/UX design, and digital marketing solutions.", true);
    setMeta("og:type", "website", true);
    setMeta("og:url", url, true);
    setMeta("og:image", imageUrl, true);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description ?? "Custom web development, AI automation, UI/UX design, and digital marketing solutions.");
    setMeta("twitter:image", imageUrl);

    setLink("canonical", url);
  }, [fullTitle, description, url, imageUrl]);

  return null;
}
