/**
 * Client for portal.revun.com — the same endpoints the MoveSmart Rentals site
 * uses, narrowed to The Bellmont (200 Old Carriage Drive, Tower A & Tower B).
 *
 *   GET  /api/properties?search=…&per_page=…   listings          (server)
 *   GET  /api/property/{slug}                   one listing       (server)
 *   GET  /api/v1/showing/slots/{slug}           showing slots     (browser)
 *   POST /api/v1/showing/store                  book a slot       (browser)
 *   POST /api/v1/showing/submit-lead            request a time    (browser, when no slots)
 *   →    /offer/reserve/{slug}                  Apply Now         (portal page)
 */
import type { PortalDetailResponse, PortalListResponse, PortalListing, PortalMedia } from "./types";

export const PORTAL_BASE_URL = (process.env.NEXT_PUBLIC_PORTAL_BASE_URL || "https://portal.revun.com").replace(/\/$/, "");

export const SHOWING_SLOTS_URL = (slug: string) => `${PORTAL_BASE_URL}/api/v1/showing/slots/${encodeURIComponent(slug)}`;
export const SHOWING_STORE_URL = `${PORTAL_BASE_URL}/api/v1/showing/store`;
export const SHOWING_REQUEST_URL = `${PORTAL_BASE_URL}/api/v1/showing/submit-lead`;

/** Apply Now: the portal handles sign-in and brings the visitor back to this offer. */
export function applyUrl(slug: string): string {
  return `${PORTAL_BASE_URL}/offer/reserve/${encodeURIComponent(slug)}`;
}

const JSON_HEADERS = { Accept: "application/json", "Content-Type": "application/json" } as const;
const REVALIDATE = 300;

/** A listing belongs to The Bellmont when it is at 200 Old Carriage Drive. */
export function isBellmont(p: Pick<PortalListing, "slug" | "unit_address" | "unit_name">): boolean {
  const hay = `${p.slug} ${p.unit_address} ${p.unit_name}`.toLowerCase();
  return hay.includes("old-carriage") || hay.includes("old carriage");
}

/**
 * Every Bellmont listing. Throws when the portal does not answer, so a failed
 * request is never shown to visitors as "nothing available" (ISR keeps the
 * last good page instead).
 */
export async function getBellmontListings(): Promise<PortalListing[]> {
  const collected: PortalListing[] = [];
  for (let page = 1; page <= 10; page++) {
    const url = new URL(`${PORTAL_BASE_URL}/api/properties`);
    url.searchParams.set("search", "old carriage");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    const res = await fetch(url, { headers: JSON_HEADERS, next: { revalidate: REVALIDATE } });
    if (!res.ok) throw new Error(`Portal listings failed: ${res.status}`);
    const json = (await res.json()) as PortalListResponse;
    if (!Array.isArray(json.data)) throw new Error("Portal listings returned no data array");
    collected.push(...json.data);
    const last = typeof json.last_page === "number" ? json.last_page : page;
    if (page >= last || json.data.length === 0) break;
  }

  const seen = new Set<string>();
  return collected.filter((p) => {
    const key = `${p.kind ?? "unit"}:${p.id}`;
    if (seen.has(key) || !isBellmont(p)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * One listing by slug. Returns null only for a genuine 404 (or a listing that
 * is not at The Bellmont); retries once and then throws on upstream errors.
 */
export async function getBellmontListing(slug: string): Promise<PortalDetailResponse["data"] | null> {
  if (!slug) return null;
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${PORTAL_BASE_URL}/api/property/${encodeURIComponent(slug)}`, {
        headers: JSON_HEADERS,
        next: { revalidate: REVALIDATE },
      });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Portal listing ${slug} failed: ${res.status}`);
      const json = (await res.json()) as PortalDetailResponse;
      if (!json?.status || !json.data?.unit) throw new Error(`Portal listing ${slug} returned no unit`);
      if (!isBellmont(json.data.unit)) return null;
      return json.data;
    } catch (err) {
      lastError = err;
      if (attempt === 0) await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/** Absolute URL for a portal image path or media row. */
export function portalImage(
  input: string | Pick<PortalMedia, "file_path" | "external_link"> | null | undefined,
): string | null {
  if (!input) return null;
  if (typeof input === "string") {
    if (/^https?:\/\//.test(input)) return input;
    return `${PORTAL_BASE_URL}${input.startsWith("/") ? "" : "/"}${input}`;
  }
  if (input.external_link) return input.external_link;
  if (input.file_path) {
    const p = input.file_path.startsWith("/") ? input.file_path : `/storage/${input.file_path}`;
    return `${PORTAL_BASE_URL}${p}`;
  }
  return null;
}
