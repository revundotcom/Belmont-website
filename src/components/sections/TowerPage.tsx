import Image from "next/image";
import { LogoMark } from "@/components/brand/Logo";
import { AmenitiesSection, CtaBand, FaqSection } from "@/components/sections/Sections";
import { SuiteCard } from "@/components/suites/SuiteCard";
import { PageHero } from "@/components/ui/PageHero";
import { ArchFrame, JsonLd, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { faqs, site } from "@/data/site";
import { getSuites, priceFrom } from "@/lib/bellmont";
import { portalImage } from "@/lib/portal";
import { faqSchema } from "@/lib/seo";
import { formatMoney, type Tower } from "@/lib/suite";

export interface TowerContent {
  tower: Tower;
  path: string;
  crumb: string;
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  includedTitle: string;
  included: string[];
  storyTitle: string;
  story: string[];
  faqQuestions: string[];
}

export async function TowerPage({ c }: { c: TowerContent }) {
  const all = await getSuites();
  const suites = all.filter((s) => s.tower === c.tower);
  const from = priceFrom(suites, () => true);
  const unit = c.tower === "A" ? "per room / month" : "per suite / month";
  const towerFaqs = faqs.filter((f) => c.faqQuestions.includes(f.q));
  const img = portalImage(c.image);

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${c.title} — ${site.name}`,
    itemListElement: suites.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${site.url}/suites/${s.slug}/`,
      name: `${s.title}, ${s.subtitle}`,
    })),
  };

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Suites", path: "/suites/" },
          { name: c.crumb, path: c.path },
        ]}
        eyebrow={c.eyebrow}
        title={c.title}
        intro={c.intro}
      >
        {from != null && (
          <p className="mt-8 font-serif text-[2rem] leading-none text-canvas">
            From {formatMoney(from)} <span className="font-sans text-base text-canvas/75">{unit}</span>
          </p>
        )}
      </PageHero>

      <section className="py-20 lg:py-28">
        <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow={c.includedTitle} title={c.storyTitle} />
            {c.story.map((p) => (
              <p key={p} className="mt-6 text-body-lg text-brown">
                {p}
              </p>
            ))}
            <ul className="mt-8 space-y-3">
              {c.included.map((i) => (
                <li key={i} className="flex gap-3 text-brown">
                  <LogoMark className="mt-1.5 w-4 min-w-0 text-gold" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          {img && (
            <ArchFrame className="mx-auto aspect-[4/5] w-full max-w-md bg-seafoam">
              <Image src={img} alt={`${site.name}, Tower ${c.tower}, Kitchener`} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            </ArchFrame>
          )}
        </div>
      </section>

      <section className="border-t border-grey/50 bg-canvas-soft/60 py-20 lg:py-28">
        <div className="container">
          <SectionHeading eyebrow={`Tower ${c.tower}`} title={`${c.crumb} for rent`} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suites.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 0.06}>
                <SuiteCard suite={s} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <AmenitiesSection more />
      {towerFaqs.length > 0 && <FaqSection items={towerFaqs} more />}
      <CtaBand />
      <JsonLd data={[listSchema, ...(towerFaqs.length ? [faqSchema(towerFaqs)] : [])]} />
    </>
  );
}
