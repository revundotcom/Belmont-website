import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import {
  AmenitiesSection,
  ContactSection,
  FaqSection,
  GallerySection,
  HowItWorks,
  NeighbourhoodSection,
  TowersSection,
} from "@/components/sections/Sections";
import { SuiteCard } from "@/components/suites/SuiteCard";
import { ArchFrame, JsonLd, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { faqs, site } from "@/data/site";
import { faqSchema } from "@/lib/seo";
import { getBuildingPhotos, getSuites, priceFrom } from "@/lib/bellmont";
import { portalImage } from "@/lib/portal";
import { formatMoney, type Suite } from "@/lib/suite";

export const revalidate = 300;

export const metadata: Metadata = {
  title: { absolute: "The Bellmont Kitchener | Rooms & Suites for Rent near Conestoga College" },
  description: site.description,
  alternates: { canonical: "/" },
};

function pickFeatured(suites: Suite[]): Suite[] {
  const a = suites.filter((s) => s.tower === "A");
  const b = suites.filter((s) => s.tower === "B");
  const out: Suite[] = [];
  for (let i = 0; out.length < 6 && (i < a.length || i < b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i] && out.length < 6) out.push(b[i]);
  }
  return out;
}

export default async function HomePage() {
  const suites = await getSuites();
  const photos = await getBuildingPhotos(suites);
  const roomFrom = priceFrom(suites, (s) => s.arrangement === "room");
  const suiteFrom = priceFrom(suites, (s) => s.arrangement === "suite");
  const featured = pickFeatured(suites);
  const towerAImage = portalImage(site.heroImage);
  const towerBImage = portalImage(site.heroImageB);

  return (
    <>
      {/* ───────────── Hero: Bell Blue field ───────────── */}
      <section className="relative overflow-hidden bg-bell text-canvas">
        <div className="container grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="animate-rise-in">
            <p className="eyebrow text-canvas/80">
              {site.address.street} · {site.address.city}
            </p>
            <h1 className="type-display mt-6 text-canvas">
              Welcome to your
              <br />
              new home.
            </h1>
            <p className="mt-6 text-body-lg text-canvas">{site.tagline}</p>
            <span className="rule-gold mt-8" aria-hidden />
            <p className="mt-8 max-w-lg text-body text-canvas/85">
              Private rooms and whole 3 and 4-bedroom suites across two towers in Kitchener&rsquo;s {site.neighbourhood}, minutes from
              Conestoga College. Utilities included except hydro.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/suites/" className="btn-canvas">
                See our suites <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a href={site.phoneHref} className="btn-outline-light">
                <Phone className="size-4" aria-hidden /> {site.phone}
              </a>
            </div>
          </div>

          {/* Two arches, two buildings — the mark, as photography */}
          <div className="relative mx-auto grid w-full max-w-xl grid-cols-2 items-end gap-3 sm:gap-4">
            <ArchFrame className="aspect-[3/5] bg-bell-700">
              {towerAImage && (
                <Image src={towerAImage} alt="The Bellmont, Tower A" fill priority sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              )}
              <span className="eyebrow absolute bottom-4 left-4 rounded-full bg-canvas/95 px-3 py-1.5 text-[0.6875rem] text-bell">Tower A</span>
            </ArchFrame>
            <ArchFrame className="aspect-[3/4] bg-bell-700">
              {towerBImage && (
                <Image src={towerBImage} alt="The Bellmont, Tower B" fill priority sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              )}
              <span className="eyebrow absolute bottom-4 left-4 rounded-full bg-canvas/95 px-3 py-1.5 text-[0.6875rem] text-bell">Tower B</span>
            </ArchFrame>
            <LogoMark className="absolute -bottom-6 left-1/2 w-12 -translate-x-1/2 text-canvas lg:-bottom-8 lg:w-14" />
          </div>
        </div>

        <div className="border-t border-canvas/15">
          <dl className="container grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4">
            {[
              { k: "Private rooms from", v: roomFrom != null ? `${formatMoney(roomFrom)}/mo` : "—" },
              { k: "Whole suites from", v: suiteFrom != null ? `${formatMoney(suiteFrom)}/mo` : "—" },
              { k: "Lease", v: "12 months" },
              { k: "Utilities", v: "All but hydro" },
            ].map((s) => (
              <div key={s.k} className="pr-4">
                <dt className="eyebrow text-canvas/70">{s.k}</dt>
                <dd className="mt-2 font-serif text-[1.75rem] leading-none text-canvas" style={{ fontVariationSettings: '"opsz" 72' }}>
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <TowersSection roomFrom={roomFrom} suiteFrom={suiteFrom} />

      {/* ───────────── Suites ───────────── */}
      <section id="suites" className="border-t border-grey/50 bg-canvas-soft/60 py-20 lg:py-28">
        <div className="container">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Suites" title="Find your suite." />
            <Link href="/suites/" className="btn-outline self-start md:self-auto">
              All {suites.length} listings <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 0.06}>
                <SuiteCard suite={s} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <AmenitiesSection more />
      <GallerySection photos={photos} more />
      <NeighbourhoodSection more />
      <HowItWorks />
      <FaqSection items={faqs.slice(0, 5)} more />
      <JsonLd data={faqSchema(faqs.slice(0, 5))} />
      <ContactSection />
    </>
  );
}
