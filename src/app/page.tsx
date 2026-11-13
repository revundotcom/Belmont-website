import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, FileSignature, Phone, Search } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { BuildingGallery } from "@/components/home/BuildingGallery";
import { ContactForm } from "@/components/home/ContactForm";
import { SuiteCard } from "@/components/suites/SuiteCard";
import { Faq } from "@/components/ui/Faq";
import { ArchFrame, Eyebrow, JsonLd, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { amenityGroups, faqs, fullAddress, inSuite, nearby, site } from "@/data/site";
import { getBuildingPhotos, getSuites, priceFrom } from "@/lib/bellmont";
import { portalImage } from "@/lib/portal";
import { formatMoney, type Suite } from "@/lib/suite";

export const revalidate = 300;

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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

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

      {/* ───────────── Two buildings ───────────── */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <SectionHeading
            eyebrow="Intro"
            title={
              <>
                Two buildings.
                <br />
                One community.
              </>
            }
            intro="Live on your own lease in a furnished room in Tower A, or take a whole suite for your household in Tower B. Same lobby, same amenities, same neighbours."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              {
                tower: "A",
                title: "Private rooms",
                body: "A furnished bedroom of your own inside a 3 or 4-bedroom suite, on an individual 12-month lease. Share the kitchen, living room, balcony and two bathrooms with your suitemates — and nothing else.",
                from: roomFrom,
                unit: "per room / month",
              },
              {
                tower: "B",
                title: "Whole suites",
                body: "A complete 3 or 4-bedroom suite on one lease, for families, friends and professionals. Two full bathrooms, in-suite laundry and a private balcony.",
                from: suiteFrom,
                unit: "per suite / month",
              },
            ].map((t, i) => (
              <Reveal key={t.tower} delay={i * 0.08}>
                <Link
                  href={`/suites/?tower=${t.tower}`}
                  className="group flex h-full flex-col rounded-[1.25rem] border border-grey/60 bg-canvas-soft p-8 transition-colors hover:border-bell/50 lg:p-10"
                >
                  <Eyebrow>Tower {t.tower}</Eyebrow>
                  <h3 className="type-h2 mt-5 text-bell">{t.title}</h3>
                  <p className="mt-4 text-body text-brown">{t.body}</p>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-10">
                    <p>
                      <span className="block text-xs text-brown-muted">From</span>
                      <span className="font-serif text-[2rem] leading-none text-bell">{formatMoney(t.from)}</span>
                      <span className="ml-2 text-sm text-brown-muted">{t.unit}</span>
                    </p>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-plum">
                      Browse <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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

      {/* ───────────── Amenities: Teal field ───────────── */}
      <section id="amenities" className="bg-teal py-20 text-canvas lg:py-28">
        <div className="container grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              light
              eyebrow="Amenities"
              title="Everything downstairs."
              intro="Work out, wind down or get work done without leaving the building. Management and maintenance are on site."
            />
            <div className="mt-10 rounded-[1.25rem] border border-canvas/15 p-6">
              <p className="eyebrow text-seafoam">In every suite</p>
              <ul className="mt-4 space-y-3">
                {inSuite.map((i) => (
                  <li key={i} className="flex gap-3 text-canvas/90">
                    <LogoMark className="mt-1 w-4 min-w-0 text-gold" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[1.25rem] bg-canvas/15 sm:grid-cols-2">
            {amenityGroups.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.06} className="bg-teal p-7 lg:p-8">
                <h3 className="font-serif text-h3 text-seafoam">{g.title}</h3>
                <ul className="mt-5 space-y-2.5 text-canvas/90">
                  {g.items.map((it) => (
                    <li key={it} className="border-b border-canvas/10 pb-2.5 last:border-0">
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Gallery ───────────── */}
      {photos.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container">
            <SectionHeading eyebrow="Gallery" title="Take a look around." />
            <div className="mt-12">
              <BuildingGallery photos={photos} />
            </div>
          </div>
        </section>
      )}

      {/* ───────────── Neighbourhood: Seafoam field ───────────── */}
      <section id="neighbourhood" className="bg-seafoam py-20 lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Neighbourhood"
              title={`${site.neighbourhood}, south Kitchener.`}
              intro={`At ${site.crossStreet}, with parks, schools, shopping and transit close by.`}
            />
            <dl className="mt-10 divide-y divide-bell/20 border-y border-bell/20">
              {nearby.map((n) => (
                <div key={n.label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-brown">{n.label}</dt>
                  <dd className="shrink-0 text-sm font-semibold text-bell">{n.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="overflow-hidden rounded-[1.25rem] border border-bell/20 bg-canvas-soft">
            <iframe
              title={`Map of ${fullAddress}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=15&output=embed`}
              className="h-[22rem] w-full lg:h-full lg:min-h-[28rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ───────────── How renting works ───────────── */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <SectionHeading eyebrow="How it works" title="Three steps to your keys." align="center" />
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: Search, title: "Choose a suite", body: "Browse rooms and suites across both towers, with prices straight from our leasing system." },
              { icon: CalendarCheck, title: "Book a showing", body: "Pick an open time on any suite's page and it's booked straight into our calendar. No back-and-forth." },
              { icon: FileSignature, title: "Apply online", body: "Press Apply Now, sign in to our secure leasing portal and finish your application in minutes." },
            ].map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08} className="relative rounded-[1.25rem] border border-grey/60 bg-canvas-soft p-8">
                <span className="font-serif text-[3rem] leading-none text-gold" style={{ fontVariationSettings: '"opsz" 144' }}>
                  0{i + 1}
                </span>
                <s.icon className="absolute right-8 top-8 size-6 text-bell" aria-hidden />
                <h3 className="type-h3 mt-6">{s.title}</h3>
                <p className="mt-3 text-brown">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="border-t border-grey/50 py-20 lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Questions" title="Good to know." intro="Anything else? Call us — someone answers 24 hours a day." />
          <Faq items={faqs} />
        </div>
        <JsonLd data={faqSchema} />
      </section>

      {/* ───────────── Contact: Bell Blue field ───────────── */}
      <section id="contact" className="bg-bell py-20 text-canvas lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              light
              eyebrow="Contact"
              title="Let's find your place."
              intro="Tell us what you're looking for and a leasing advisor will get back to you."
            />
            <div className="mt-10 space-y-6">
              <div>
                <p className="eyebrow text-canvas/75">Call us, any time</p>
                <a href={site.phoneHref} className="mt-2 block font-serif text-[2.25rem] leading-none text-canvas hover:text-white">
                  {site.phone}
                </a>
              </div>
              <div>
                <p className="eyebrow text-canvas/75">Visit</p>
                <p className="mt-2 text-canvas/90">{fullAddress}</p>
              </div>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
