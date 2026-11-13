import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getSuites } from "@/lib/bellmont";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const suites = await getSuites().catch(() => []);
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/suites/`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...suites.map((s) => ({ url: `${site.url}/suites/${s.slug}/`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
