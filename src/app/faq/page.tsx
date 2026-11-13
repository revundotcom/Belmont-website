import { CtaBand } from "@/components/sections/Sections";
import { Faq } from "@/components/ui/Faq";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/ui/primitives";
import { faqs, site } from "@/data/site";
import { faqSchema, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "FAQ — Leases, Utilities, Parking & Tours",
  description:
    "Answers about renting at The Bellmont in Kitchener: utilities (hydro only), 12-month leases, furnished rooms, in-suite laundry, parking, tours and how to apply.",
  path: "/faq/",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "FAQ", path: "/faq/" }]}
        eyebrow="Questions"
        title="Good to know."
        intro={
          <>
            Can&rsquo;t find your answer? Call{" "}
            <a href={site.phoneHref} className="font-semibold text-canvas underline decoration-canvas/40 underline-offset-4">
              {site.phone}
            </a>{" "}
            — someone answers 24 hours a day.
          </>
        }
      />
      <section className="py-20 lg:py-28">
        <div className="container max-w-4xl">
          <Faq items={faqs} />
        </div>
      </section>
      <JsonLd data={faqSchema(faqs)} />
      <CtaBand />
    </>
  );
}
