import Link from "next/link";
import { ArrowRight, CalendarCheck, FileSignature, Phone, Search } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { BuildingGallery } from "@/components/home/BuildingGallery";
import { Faq } from "@/components/ui/Faq";
import { Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { amenityGroups, fullAddress, inSuite, nearby, site } from "@/data/site";
import type { BuildingPhoto } from "@/lib/bellmont";
import { formatMoney } from "@/lib/suite";

/**
 * The building's sections, shared by the home page (short, with a link onward)
 * and each section's own page (full).
 */

function MoreLink({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return (
    <Link href={href} className={light ? "btn-outline-light mt-10" : "btn-outline mt-10"}>
      {children} <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}

/* ───────────── Two towers ───────────── */
export function TowersSection({ roomFrom, suiteFrom, heading = true }: { roomFrom: number | null; suiteFrom: number | null; heading?: boolean }) {
  const towers = [
    {
      tower: "A",
      href: "/private-rooms/",
      title: "Private rooms",
      body: "A furnished bedroom of your own inside a 3 or 4-bedroom suite, on an individual 12-month lease. Share the kitchen, living room, balcony and two bathrooms with your suitemates — and nothing else.",
      from: roomFrom,
      unit: "per room / month",
    },
    {
      tower: "B",
      href: "/whole-suites/",
      title: "Whole suites",
      body: "A complete 3 or 4-bedroom suite on one lease, for families, friends and professionals. Two full bathrooms, in-suite laundry and a private balcony.",
      from: suiteFrom,
      unit: "per suite / month",
    },
  ];
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        {heading && (
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
        )}
        <div className={heading ? "mt-14 grid gap-6 md:grid-cols-2" : "grid gap-6 md:grid-cols-2"}>
          {towers.map((t, i) => (
            <Reveal key={t.tower} delay={i * 0.08}>
              <Link href={t.href} className="group flex h-full flex-col rounded-[1.25rem] border border-grey/60 bg-canvas-soft p-8 transition-colors hover:border-bell/50 lg:p-10">
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
                    Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── Amenities: Teal field ───────────── */
export function AmenitiesSection({ more = false, headingLevel = "h2" }: { more?: boolean; headingLevel?: "h2" | "h3" }) {
  return (
    <section id="amenities" className="bg-teal py-20 text-canvas lg:py-28">
      <div className="container grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          {headingLevel === "h2" ? (
            <SectionHeading
              light
              eyebrow="Amenities"
              title="Everything downstairs."
              intro="Work out, wind down, get work done or grab groceries at the 24/7 convenience store — without leaving the building. Management and maintenance are on site."
            />
          ) : (
            <>
              <p className="eyebrow text-canvas/75">At a glance</p>
              <h2 className="type-h1 mt-4 text-canvas">Shared by both towers.</h2>
            </>
          )}
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
          {more && <MoreLink href="/amenities/" light>Explore amenities</MoreLink>}
        </div>
        <div className="grid gap-px self-start overflow-hidden rounded-[1.25rem] bg-canvas/15 sm:grid-cols-2">
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
  );
}

/* ───────────── Gallery ───────────── */
export function GallerySection({ photos, more = false }: { photos: BuildingPhoto[]; more?: boolean }) {
  if (photos.length === 0) return null;
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <SectionHeading eyebrow="Gallery" title="Take a look around." />
        <div className="mt-12">
          <BuildingGallery photos={photos} />
        </div>
        {more && <MoreLink href="/gallery/">Open the gallery</MoreLink>}
      </div>
    </section>
  );
}

/* ───────────── Neighbourhood: Seafoam field ───────────── */
export function NeighbourhoodSection({ more = false, heading = true }: { more?: boolean; heading?: boolean }) {
  return (
    <section id="neighbourhood" className="bg-seafoam py-20 lg:py-28">
      <div className="container grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          {heading ? (
            <SectionHeading eyebrow="Neighbourhood" title={`${site.neighbourhood}, south Kitchener.`} intro={`At ${site.crossStreet}, with parks, schools, shopping and transit close by.`} />
          ) : (
            <>
              <p className="eyebrow text-bell">Distances</p>
              <h2 className="type-h1 mt-4">What&rsquo;s nearby.</h2>
            </>
          )}
          <dl className="mt-10 divide-y divide-bell/20 border-y border-bell/20">
            {nearby.map((n) => (
              <div key={n.label} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-brown">{n.label}</dt>
                <dd className="shrink-0 text-sm font-semibold text-bell">{n.value}</dd>
              </div>
            ))}
          </dl>
          {more && <MoreLink href="/neighbourhood/">About the neighbourhood</MoreLink>}
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
  );
}

/* ───────────── How renting works ───────────── */
export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <SectionHeading eyebrow="How it works" title="Three steps to your keys." align="center" />
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: Search, title: "Choose a suite", body: "Browse rooms and suites across both towers, with prices straight from our leasing system." },
            { icon: CalendarCheck, title: "Schedule a tour", body: "Pick an open time on any suite's page and it's booked straight into our calendar. No back-and-forth." },
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
  );
}

/* ───────────── FAQ ───────────── */
export function FaqSection({ items, more = false, title = "Good to know." }: { items: readonly { q: string; a: string }[]; more?: boolean; title?: string }) {
  return (
    <section className="border-t border-grey/50 py-20 lg:py-28">
      <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Questions" title={title} intro="Anything else? Call us — someone answers 24 hours a day." />
          {more && <MoreLink href="/faq/">All questions</MoreLink>}
        </div>
        <Faq items={items} />
      </div>
    </section>
  );
}

/* ───────────── Contact: Bell Blue field ───────────── */
export function ContactSection({ heading = true }: { heading?: boolean }) {
  return (
    <section id="contact" className="bg-bell py-20 text-canvas lg:py-28">
      <div className="container grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          {heading ? (
            <SectionHeading light eyebrow="Contact" title="Let's find your place." intro="Call us with any question, or book a tour of the suite you like." />
          ) : (
            <>
              <p className="eyebrow text-canvas/75">Leasing office</p>
              <h2 className="type-h1 mt-4 text-canvas">Talk to a leasing advisor.</h2>
            </>
          )}
          <div className="mt-10 space-y-6">
            <div>
              <p className="eyebrow text-canvas/75">Call us, any time</p>
              <a href={site.phoneHref} className="mt-2 inline-flex items-center gap-3 font-serif text-[2.25rem] leading-none text-canvas hover:text-white">
                <Phone className="size-6" aria-hidden /> {site.phone}
              </a>
              <p className="mt-2 text-sm text-canvas/75">Answered {site.phoneHours}.</p>
            </div>
            <div>
              <p className="eyebrow text-canvas/75">Visit</p>
              <p className="mt-2 text-canvas/90">{fullAddress}</p>
            </div>
          </div>
        </div>
        <TourCard />
      </div>
    </section>
  );
}

/** Every enquiry goes through the tour booking (showing APIs), so the leasing team gets it as a showing. */
function TourCard() {
  const steps = [
    "Choose a private room or whole suite.",
    "Pick an open time on its page, or request one.",
    "We confirm and show you around.",
  ];
  return (
    <div className="flex flex-col rounded-[1.25rem] bg-canvas-soft p-6 text-brown sm:p-8">
      <CalendarCheck className="size-9 text-bell" aria-hidden />
      <h3 className="type-h2 mt-5">Book a tour</h3>
      <p className="mt-3 text-body text-brown-muted">The quickest way to see The Bellmont and get your questions answered in person.</p>
      <ol className="mt-6 space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-start gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-bell font-serif text-sm text-canvas">{i + 1}</span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link href="/suites/" className="btn-plum">
          Choose a suite to tour <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <p className="mt-4 text-sm text-brown-muted">
        Prefer to talk? Call{" "}
        <a href={site.phoneHref} className="font-semibold text-brown underline underline-offset-2 hover:text-plum">
          {site.phone}
        </a>{" "}
        and we&rsquo;ll book it for you.
      </p>
    </div>
  );
}

/* ───────────── Closing call to action ───────────── */
export function CtaBand({ title = "Ready to see it in person?", body = "Pick a suite, choose a time and we'll show you around." }: { title?: string; body?: string }) {
  return (
    <section className="bg-teal py-16 text-canvas lg:py-20">
      <div className="container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <h2 className="type-h1 text-canvas">{title}</h2>
          <p className="mt-3 max-w-xl text-body-lg text-canvas/85">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/suites/" className="btn-canvas">
            See our suites <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a href={site.phoneHref} className="btn-outline-light">
            <Phone className="size-4" aria-hidden /> {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
