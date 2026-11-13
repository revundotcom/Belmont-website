import { AmenitiesSection, CtaBand, GallerySection } from "@/components/sections/Sections";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { amenityHighlights } from "@/data/site";
import { getBuildingPhotos, getSuites } from "@/lib/bellmont";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Amenities — Gym, 24/7 Store, Study Rooms & Parking",
  description:
    "Amenities at The Bellmont, 200 Old Carriage Drive, Kitchener: 24/7 convenience store, fitness centre, yoga room, theatre, games room, five meeting rooms, two study rooms, underground parking and on-site management.",
  path: "/amenities/",
});

export default async function AmenitiesPage() {
  const suites = await getSuites().catch(() => []);
  const photos = await getBuildingPhotos(suites);

  return (
    <>
      <PageHero
        crumbs={[{ name: "Amenities", path: "/amenities/" }]}
        eyebrow="Amenities"
        title="Everything downstairs."
        intro="A 24/7 convenience store, a gym, places to study and space to unwind — shared by both towers, with management and maintenance on site."
      />

      <section className="py-20 lg:py-28">
        <div className="container">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {amenityHighlights.map((a, i) => (
              <Reveal as="li" key={a.title} delay={(i % 3) * 0.06} className="rounded-[1.25rem] border border-grey/60 bg-canvas-soft p-8">
                <span className="rule-gold" aria-hidden />
                <h2 className="type-h3 mt-6">{a.title}</h2>
                <p className="mt-3 text-brown">{a.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <AmenitiesSection headingLevel="h3" />
      <GallerySection photos={photos} more />
      <CtaBand />
    </>
  );
}
