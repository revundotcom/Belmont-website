import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getSuites } from "@/lib/bellmont";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const suites = await getSuites().catch(() => []);
  const now = new Date();
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "daily"],
    ["/suites/", 0.9, "daily"],
    ["/private-rooms/", 0.9, "daily"],
    ["/whole-suites/", 0.9, "daily"],
    ["/amenities/", 0.7, "monthly"],
    ["/gallery/", 0.6, "monthly"],
    ["/neighbourhood/", 0.6, "monthly"],
    ["/faq/", 0.6, "monthly"],
    ["/contact/", 0.6, "yearly"],
  ];
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${site.url}${path}`, lastModified: now, changeFrequency, priority })),
    ...suites.map((s) => ({
      url: `${site.url}/suites/${s.slug}/`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
      ...(s.image ? { images: [s.image] } : {}),
    })),
  ];
}
