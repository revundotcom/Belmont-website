import { CtaBand, NeighbourhoodSection } from "@/components/sections/Sections";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Neighbourhood — Pioneer Park, Kitchener near Conestoga College",
  description:
    "The Bellmont is at 200 Old Carriage Drive in Kitchener's Pioneer Park, minutes from Conestoga College's Kitchener campus and about 20 minutes from the University of Waterloo and Wilfrid Laurier University.",
  path: "/neighbourhood/",
});

export default function NeighbourhoodPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Neighbourhood", path: "/neighbourhood/" }]}
        eyebrow="Neighbourhood"
        title={`${site.neighbourhood}, south Kitchener.`}
        intro={`At ${site.crossStreet}, a few minutes from Conestoga College, with parks, schools, shopping and transit close by.`}
      />

      <section className="py-20 lg:py-28">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Location" title="Close to campus, close to everything." />
          <div className="space-y-5 text-body-lg text-brown">
            <p>
              The Bellmont sits at {site.address.street} in the {site.neighbourhood} area of south Kitchener, at {site.crossStreet}. Conestoga
              College&rsquo;s Kitchener campus is a few minutes away, and the University of Waterloo and Wilfrid Laurier University are about 20
              minutes away.
            </p>
            <p>
              The area around the building has parks, places of worship, public transit, a recreation and community centre, schools and shopping
              nearby. Families are served by Pioneer Park Public School and Huron Heights Secondary School in the Waterloo Region District School
              Board.
            </p>
          </div>
        </div>
      </section>

      <NeighbourhoodSection heading={false} />
      <CtaBand title="Come see the neighbourhood." />
    </>
  );
}
