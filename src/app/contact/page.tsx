import { ContactSection } from "@/components/sections/Sections";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/ui/primitives";
import { fullAddress, site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact & Leasing Office",
  description: `Contact The Bellmont leasing team: call ${site.phone} any time, or book a tour online. ${fullAddress}.`,
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact/" }]}
        eyebrow="Contact"
        title="Let's find your place."
        intro="Call us any time — we answer 24 hours a day, 7 days a week — or book a tour of the suite you like."
      />
      <ContactSection heading={false} />
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="overflow-hidden rounded-[1.25rem] border border-grey/60">
            <iframe
              title={`Map of ${fullAddress}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=15&output=embed`}
              className="h-[24rem] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${site.url}/contact/`,
          about: { "@id": `${site.url}/#residence` },
        }}
      />
    </>
  );
}
