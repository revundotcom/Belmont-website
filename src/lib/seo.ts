import type { Metadata } from "next";
import { site } from "@/data/site";

/** Consistent per-page metadata: canonical URL, OpenGraph and Twitter cards. */
export function pageMeta({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
}): Metadata {
  const fullTitle = `${title} | ${site.name}`;
  // A page's own photo when it has one, else the brand share card (app/opengraph-image.tsx).
  const images = image ? [{ url: image, alt: title }] : [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: "en_CA", siteName: site.name, title: fullTitle, description, url: path, ...(images ? { images } : {}) },
    twitter: { card: "summary_large_image", title: fullTitle, description, ...(images ? { images: images.map((i) => i.url) } : {}) },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.path}`,
    })),
  };
}

export function faqSchema(items: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
