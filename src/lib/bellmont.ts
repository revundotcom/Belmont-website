import { cache } from "react";
import { getBellmontListing, getBellmontListings, portalImage } from "./portal";
import { sortSuites, toSuite, type Suite } from "./suite";

/** All Bellmont listings as cards, sorted. One portal request per render pass. */
export const getSuites = cache(async (): Promise<Suite[]> => sortSuites((await getBellmontListings()).map(toSuite)));

export const getListing = cache((slug: string) => getBellmontListing(slug));

export interface BuildingPhoto {
  src: string;
  alt: string;
}

/**
 * Building photos (lobby, amenities, exterior) for the home page. The portal
 * attaches them to every listing's detail, per tower, so one listing from each
 * tower is enough. Never throws: the page renders without a gallery instead.
 */
export async function getBuildingPhotos(suites: Suite[]): Promise<BuildingPhoto[]> {
  const picks = (["A", "B"] as const)
    .map((t) => suites.find((s) => s.tower === t))
    .filter((s): s is Suite => Boolean(s));
  const details = await Promise.all(picks.map((s) => getListing(s.slug).catch(() => null)));
  const seen = new Set<string>();
  const out: BuildingPhoto[] = [];
  details.forEach((d) => {
    const unit = d?.unit;
    if (!unit) return;
    const tower = /tower b/i.test(unit.unit_address) ? "Tower B" : "Tower A";
    const media = unit.building?.media ?? unit.media?.filter((m) => m.is_building) ?? [];
    for (const m of media) {
      if (m.file_type && m.file_type !== "image") continue;
      const src = portalImage(m);
      if (!src || seen.has(src)) continue;
      seen.add(src);
      out.push({ src, alt: `The Bellmont, ${tower}` });
    }
  });
  return out;
}

export function priceFrom(suites: Suite[], filter: (s: Suite) => boolean): number | null {
  const prices = suites.filter(filter).map((s) => s.price).filter((n): n is number => n != null);
  return prices.length ? Math.min(...prices) : null;
}
