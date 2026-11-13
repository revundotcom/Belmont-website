import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, Building2, Car, ExternalLink, Layers, Ruler } from "lucide-react";
import { ShowingProvider } from "@/components/showing/ShowingProvider";
import { CallLink, MobileActionBar, ShowingButton, ShowingStrip } from "@/components/showing/ShowingControls";
import { SuiteCard } from "@/components/suites/SuiteCard";
import { SuiteGallery } from "@/components/suites/SuiteGallery";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { amenityGroups, site } from "@/data/site";
import { getListing, getSuites } from "@/lib/bellmont";
import { applyUrl, isBellmont } from "@/lib/portal";
import { listingGallery, parseListingCopy, toSuite } from "@/lib/suite";

export const revalidate = 1800;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

/*
 * Same as the MoveSmart site: nothing is rendered at build time. Each suite page
 * is built on its first visit, cached, and only refreshed when someone visits
 * after it has gone stale — no visitors, no portal requests. If a refresh fails,
 * the last good page keeps being served.
 */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getListing(slug).catch(() => null);
  if (!data) return { title: "Suite not found" };
  const s = toSuite(data.unit);
  const title = `${s.title}${s.tower ? `, Tower ${s.tower}` : ""} — ${s.priceLabel} ${s.priceUnit}`;
  const description = parseListingCopy(data.unit.description_html, data.unit.description).sections[0]?.paragraphs[0]?.slice(0, 158) ?? site.description;
  return {
    title,
    description,
    alternates: { canonical: `/suites/${slug}/` },
    openGraph: { title: `${title} | ${site.name}`, description, url: `/suites/${slug}/`, images: s.image ? [{ url: s.image }] : undefined },
  };
}

export default async function SuitePage({ params }: Props) {
  const { slug } = await params;
  const data = await getListing(slug);
  if (!data) notFound();

  const unit = data.unit;
  const suite = toSuite(unit);
  const copy = parseListingCopy(unit.description_html, unit.description);
  const [lead, ...sections] = copy.sections;
  const gallery = listingGallery(unit).map((g, i) => ({
    src: g.src,
    alt: `${suite.title}${suite.tower ? `, Tower ${suite.tower}` : ""} — photo ${i + 1}`,
  }));
  const apply = applyUrl(unit.slug);
  const building = unit.building;
  const sqft = unit.approximate_square_footage ? Number(unit.approximate_square_footage) : null;
  const parking = unit.number_of_parking_spots ? Number(unit.number_of_parking_spots) : null;

  // Similar listings: the portal's picks first, topped up from the same tower.
  const all = await getSuites().catch(() => []);
  const similar = [
    ...(data.similar_properties ?? []).filter(isBellmont).map(toSuite),
    ...all.filter((s) => s.tower === suite.tower),
    ...all,
  ]
    .filter((s, i, arr) => s.slug !== suite.slug && arr.findIndex((x) => x.slug === s.slug) === i)
    .slice(0, 3);

  const facts = [
    suite.tower && { icon: Building2, label: "Tower", value: `Tower ${suite.tower}` },
    suite.floors && { icon: Layers, label: "Floors", value: suite.floors.replace("Floors ", "") },
    suite.suiteBedrooms && {
      icon: BedDouble,
      label: suite.arrangement === "room" ? "Suite" : "Bedrooms",
      value: suite.arrangement === "room" ? `${suite.suiteBedrooms}-bedroom, shared` : `${suite.suiteBedrooms} bedrooms`,
    },
    suite.bathrooms && { icon: Bath, label: "Bathrooms", value: `${suite.bathrooms} full${suite.arrangement === "room" ? ", shared" : ""}` },
    sqft && { icon: Ruler, label: "Suite size", value: `${sqft.toLocaleString("en-CA")} sq ft` },
    parking && { icon: Car, label: "Parking", value: `Up to ${parking}, underground` },
  ].filter(Boolean) as { icon: typeof Building2; label: string; value: string }[];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: `${suite.title} at ${site.name}`,
    url: `${site.url}/suites/${slug}/`,
    image: gallery.slice(0, 5).map((g) => g.src),
    numberOfBedrooms: suite.arrangement === "room" ? 1 : suite.suiteBedrooms ?? undefined,
    numberOfBathroomsTotal: suite.bathrooms ?? undefined,
    floorSize: sqft ? { "@type": "QuantitativeValue", value: sqft, unitCode: "FTK" } : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.regionCode,
      postalCode: site.address.postalCode,
      addressCountry: "CA",
    },
    containedInPlace: { "@id": `${site.url}/#residence` },
    offers: suite.price
      ? {
          "@type": "Offer",
          price: suite.price,
          priceCurrency: "CAD",
          availability: suite.availableCount > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        }
      : undefined,
  };

  return (
    <ShowingProvider unitId={unit.slug} suiteTitle={`${suite.title} · ${suite.subtitle}`}>
      <div className="pb-28 lg:pb-0">
        <div className="container pt-6 lg:pt-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-brown-muted">
            <Link href="/suites/" className="inline-flex items-center gap-1.5 font-semibold text-bell hover:text-plum">
              <ArrowLeft className="size-4" aria-hidden /> All suites
            </Link>
            <span aria-hidden>/</span>
            <span className="truncate">
              Tower {suite.tower} · {suite.floors}
            </span>
          </nav>

          <div className="mt-6">
            <SuiteGallery images={gallery} />
          </div>
        </div>

        <div className="container mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          {/* ───────── Main column ───────── */}
          <div className="min-w-0">
            <p className="eyebrow text-bell">
              {suite.subtitle}
              {suite.code && <span className="ml-3 text-brown-muted">Listing {suite.code}</span>}
            </p>
            <h1 className="type-h1 mt-4">{suite.title}</h1>
            <p className="mt-3 text-body-lg text-brown-muted">
              {site.address.street}, {site.address.city} · {building?.neighbourhood ?? site.neighbourhood}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[1.25rem] border border-grey/60 bg-grey/60 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="bg-canvas-soft p-5">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brown-muted">
                    <f.icon className="size-4 text-bell" aria-hidden /> {f.label}
                  </dt>
                  <dd className="mt-2 font-serif text-[1.25rem] leading-snug text-bell" style={{ fontVariationSettings: '"opsz" 36' }}>
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            {lead && (
              <div className="mt-10">
                <span className="rule-gold" aria-hidden />
                {lead.paragraphs.map((p) => (
                  <p key={p} className="mt-6 text-body-lg text-brown">
                    {p}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-12">
              <ShowingStrip />
            </div>

            {sections.length > 0 && (
              <div className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2">
                {sections.map((s, i) => (
                  <Reveal key={`${s.heading}-${i}`}>
                    <h2 className="type-h3">{s.heading}</h2>
                    {s.paragraphs.map((p) => (
                      <p key={p} className="mt-3 text-body text-brown">
                        {p}
                      </p>
                    ))}
                  </Reveal>
                ))}
              </div>
            )}

            <section className="mt-16 rounded-[1.25rem] bg-teal p-7 text-canvas sm:p-10" aria-labelledby="amenities-h">
              <p className="eyebrow text-seafoam">Building amenities</p>
              <h2 id="amenities-h" className="type-h2 mt-3 text-canvas">
                Shared by both towers.
              </h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {amenityGroups.map((g) => (
                  <div key={g.title}>
                    <h3 className="font-serif text-h3 text-seafoam">{g.title}</h3>
                    <ul className="mt-3 space-y-1.5 text-canvas/90">
                      {g.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {building && (building.cross_street || building.elementary_school || building.high_school) && (
              <section className="mt-16" aria-labelledby="area-h">
                <p className="eyebrow text-bell">The area</p>
                <h2 id="area-h" className="type-h2 mt-3">
                  {building.neighbourhood ?? site.neighbourhood}
                </h2>
                <dl className="mt-6 divide-y divide-grey/60 border-y border-grey/60">
                  {[
                    ["Cross streets", building.cross_street],
                    ["Elementary school", building.elementary_school],
                    ["Secondary school", building.high_school],
                    ["Conestoga College, Kitchener", "A few minutes away"],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k as string} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between">
                        <dt className="text-brown-muted">{k}</dt>
                        <dd className="font-semibold text-bell">{v}</dd>
                      </div>
                    ))}
                </dl>
              </section>
            )}

            {copy.faqs.length > 0 && (
              <section className="mt-16" aria-labelledby="faq-h">
                <p className="eyebrow text-bell">Questions</p>
                <h2 id="faq-h" className="type-h2 mb-6 mt-3">
                  People also ask
                </h2>
                <Faq items={copy.faqs} />
              </section>
            )}
          </div>

          {/* ───────── Sticky action card ───────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-[1.25rem] border border-grey/60 bg-canvas-soft p-7 shadow-[0_24px_60px_-40px_rgba(26,51,56,0.6)]">
              <p className="eyebrow text-bell">{suite.arrangement === "room" ? "Private room" : "Whole suite"}</p>
              <p className="mt-3 font-serif text-[2.75rem] leading-none text-bell" style={{ fontVariationSettings: '"opsz" 144' }}>
                {suite.priceLabel}
              </p>
              <p className="mt-2 text-sm text-brown-muted">{suite.priceUnit} · 12-month lease</p>
              <div className="mt-6 space-y-3">
                <a href={apply} className="btn-plum w-full">
                  Apply Now <ExternalLink className="size-4" aria-hidden />
                </a>
                <ShowingButton className="w-full" />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-brown-muted">Apply Now opens our secure leasing portal, where you sign in and complete your application.</p>
              <div className="mt-6 border-t border-grey/60 pt-5">
                <CallLink />
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-20 border-t border-grey/50 bg-canvas-soft/60 py-16 lg:mt-28 lg:py-24">
            <div className="container">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow text-bell">More at The Bellmont</p>
                  <h2 className="type-h2 mt-3">You might also like</h2>
                </div>
                <Link href="/suites/" className="link-plum">
                  See all suites
                </Link>
              </div>
              <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((s) => (
                  <li key={s.slug}>
                    <SuiteCard suite={s} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>

      <MobileActionBar applyHref={apply} priceLabel={suite.priceLabel} priceUnit={suite.priceUnit} />
      <JsonLd data={schema} />
    </ShowingProvider>
  );
}
