import type { PortalListing, PortalListingDetail } from "./types";
import { portalImage } from "./portal";

export type Tower = "A" | "B";
export type Arrangement = "room" | "suite";

/** What a card needs, derived once from a portal listing. */
export interface Suite {
  slug: string;
  code: string | null;
  tower: Tower | null;
  arrangement: Arrangement;
  suiteBedrooms: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floors: string | null;
  floorBand: "low" | "mid" | "high" | null;
  title: string;
  subtitle: string;
  price: number | null;
  priceLabel: string;
  priceUnit: string;
  availableCount: number;
  upcomingCount: number;
  image: string | null;
  thumb: string | null;
  excerpt: string | null;
  showUnit: string | null;
}

const num = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
};

export function formatMoney(n: number | null): string {
  if (n == null) return "Contact us";
  return `$${n.toLocaleString("en-CA", { maximumFractionDigits: 0 })}`;
}

export function toSuite(p: PortalListing): Suite {
  const hay = `${p.slug} ${p.describes ?? ""} ${p.unit_address}`.toLowerCase();
  const tower: Tower | null = /tower[- ]?a\b/.test(hay) ? "A" : /tower[- ]?b\b/.test(hay) ? "B" : null;
  const arrangement: Arrangement = /room-in|per bedroom/.test(hay) ? "room" : "suite";
  const bedsMatch = hay.match(/(\d)-bedroom/);
  const suiteBedrooms = bedsMatch ? Number(bedsMatch[1]) : null;
  const floorsMatch = (p.describes ?? p.badge ?? "").match(/Floors?\s+(\d+)\s+to\s+(\d+)/i);
  const floors = floorsMatch ? `Floors ${floorsMatch[1]}–${floorsMatch[2]}` : null;
  const lo = floorsMatch ? Number(floorsMatch[1]) : null;
  const floorBand = lo == null ? null : lo <= 1 ? "low" : lo <= 6 ? "mid" : "high";
  const price = num(p.website_price);

  const size = suiteBedrooms ? `${suiteBedrooms}-bedroom` : null;
  const title =
    arrangement === "room"
      ? `Private room in a ${size ?? "shared"} suite`
      : `Whole ${size ? `${size} ` : ""}suite`;

  const subtitle = [tower ? `Tower ${tower}` : null, floors].filter(Boolean).join(" · ");
  const showUnit = p.unit_name?.match(/#\s?([A-Z0-9]+)|\b([A-Z]\d{3,4})\b/);

  return {
    slug: p.slug,
    code: p.advert_code ?? null,
    tower,
    arrangement,
    suiteBedrooms,
    bedrooms: num(p.number_of_bedrooms),
    bathrooms: num(p.number_of_bathrooms),
    floors,
    floorBand,
    title,
    subtitle,
    price,
    priceLabel: formatMoney(price),
    priceUnit: arrangement === "room" ? "/ month per room" : "/ month",
    availableCount: p.available_count ?? 0,
    upcomingCount: p.upcoming_count ?? 0,
    image: portalImage(p.cover_photo_url ?? p.cover_thumb ?? null),
    thumb: portalImage(p.cover_thumb ?? p.cover_photo_url ?? null),
    excerpt: firstSentence(p.website_description),
    showUnit: showUnit ? showUnit[1] || showUnit[2] : null,
  };
}

function firstSentence(text: string | null | undefined): string | null {
  if (!text) return null;
  const clean = decodeEntities(text).trim();
  const m = clean.match(/^(.{40,220}?[.!?])\s/);
  return m ? m[1] : clean.slice(0, 200);
}

/** Tower A first, then by suite size, floors and price. */
export function sortSuites(list: Suite[]): Suite[] {
  const band = { low: 0, mid: 1, high: 2 } as const;
  return [...list].sort(
    (a, b) =>
      (a.tower ?? "Z").localeCompare(b.tower ?? "Z") ||
      (a.suiteBedrooms ?? 9) - (b.suiteBedrooms ?? 9) ||
      (a.floorBand ? band[a.floorBand] : 9) - (b.floorBand ? band[b.floorBand] : 9) ||
      (a.price ?? 0) - (b.price ?? 0),
  );
}

export function availabilityText(s: Pick<Suite, "availableCount" | "upcomingCount" | "arrangement">): string {
  const noun = s.arrangement === "room" ? "room" : "suite";
  if (s.availableCount > 0) return `${s.availableCount} ${noun}${s.availableCount === 1 ? "" : "s"} available`;
  if (s.upcomingCount > 0) return `${s.upcomingCount} coming available`;
  return "Join the waitlist";
}

// ---------------------------------------------------------------------------
// Listing copy → structured sections
// ---------------------------------------------------------------------------

export interface CopySection {
  heading: string | null;
  paragraphs: string[];
}
export interface ParsedCopy {
  sections: CopySection[];
  faqs: { q: string; a: string }[];
  closing: string | null;
}

export function decodeEntities(s: string): string {
  return s
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}

const strip = (s: string) => decodeEntities(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

/**
 * The portal writes each listing as <p> blocks where short, unpunctuated lines
 * are headings ("What it costs") and "Questions people ask us" is followed by
 * question<br>answer pairs. This turns that into sections + an FAQ.
 */
export function parseListingCopy(html: string | null | undefined, fallback?: string | null): ParsedCopy {
  const out: ParsedCopy = { sections: [], faqs: [], closing: null };
  const source = html || (fallback ? `<p>${fallback}</p>` : "");
  const blocks = [...source.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => m[1]);
  let current: CopySection = { heading: null, paragraphs: [] };
  let inFaq = false;

  for (const raw of blocks) {
    const text = strip(raw.replace(/<br\s*\/?>/gi, "\n"));
    if (!text) continue;
    const isHeading = text.length <= 48 && !/[.!?:]$/.test(text) && !/<br/i.test(raw);
    if (isHeading) {
      if (current.heading || current.paragraphs.length) out.sections.push(current);
      inFaq = /question/i.test(text);
      current = { heading: text, paragraphs: [] };
      continue;
    }
    if (inFaq && /<br\s*\/?>/i.test(raw)) {
      const [q, ...rest] = raw.split(/<br\s*\/?>/i);
      out.faqs.push({ q: strip(q), a: strip(rest.join(" ")) });
      continue;
    }
    if (inFaq) {
      out.closing = text;
      continue;
    }
    current.paragraphs.push(text);
  }
  if (!inFaq && (current.heading || current.paragraphs.length)) out.sections.push(current);
  // The FAQ heading itself carries no paragraphs; drop empty sections.
  out.sections = out.sections.filter((s) => s.paragraphs.length > 0);
  return out;
}

/** Gallery for a listing: its own photos first, then the building's, de-duplicated. */
export function listingGallery(unit: PortalListingDetail): { src: string; category: string }[] {
  const seen = new Set<string>();
  const out: { src: string; category: string }[] = [];
  const push = (src: string | null, category: string) => {
    if (!src) return;
    const key = src.replace("/thumbs/", "/");
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ src: key, category });
  };
  push(portalImage(unit.cover_photo_url ?? null), "suite");
  for (const m of unit.media ?? []) {
    if (m.file_type && m.file_type !== "image") continue;
    push(portalImage(m), m.is_building ? "building" : m.category || "suite");
  }
  return out;
}
