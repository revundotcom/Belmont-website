import { PhotoGrid } from "@/components/media/PhotoGrid";
import { CtaBand } from "@/components/sections/Sections";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/primitives";
import { getBuildingPhotos, getSuites } from "@/lib/bellmont";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Photo Gallery — Building, Amenities & Suites",
  description:
    "Photos of The Bellmont in Kitchener: both towers, the lobby, lounges, fitness and study spaces, the 24/7 convenience store, and the private rooms and whole suites for rent.",
  path: "/gallery/",
});

export default async function GalleryPage() {
  const suites = await getSuites().catch(() => []);
  const building = await getBuildingPhotos(suites);
  const seen = new Set(building.map((p) => p.src));
  const insides = suites
    .filter((s) => s.image && !seen.has(s.image))
    .map((s) => ({ src: s.image as string, alt: `${s.title}, ${s.subtitle} — The Bellmont, Kitchener` }));

  return (
    <>
      <PageHero
        crumbs={[{ name: "Gallery", path: "/gallery/" }]}
        eyebrow="Gallery"
        title="Take a look around."
        intro="The towers, the lobby, the amenities and the suites — tap any photo to see it full size."
      />

      {building.length > 0 && (
        <section className="py-20 lg:py-24">
          <div className="container">
            <SectionHeading eyebrow="The building" title="Towers, lobby & amenities" />
            <div className="mt-10">
              <PhotoGrid photos={building} />
            </div>
          </div>
        </section>
      )}

      {insides.length > 0 && (
        <section className="border-t border-grey/50 py-20 lg:py-24">
          <div className="container">
            <SectionHeading eyebrow="Inside" title="Rooms & suites" />
            <div className="mt-10">
              <PhotoGrid photos={insides} />
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
