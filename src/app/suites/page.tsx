import Link from "next/link";
import { SuitesBrowser } from "@/components/suites/SuitesBrowser";
import { PageHero } from "@/components/ui/PageHero";
import { JsonLd } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { getSuites } from "@/lib/bellmont";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Rooms & Apartments for Rent in Kitchener",
  description:
    "Every room and suite for rent at The Bellmont, 200 Old Carriage Drive, Kitchener: private furnished rooms in Tower A and whole 3 and 4-bedroom suites in Tower B. Schedule a tour or apply online.",
  path: "/suites/",
});

export default async function SuitesPage({ searchParams }: { searchParams: Promise<{ tower?: string }> }) {
  const { tower } = await searchParams;
  const suites = await getSuites();
  const initialTower = tower === "A" || tower === "B" ? tower : "all";

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Rooms & suites for rent at ${site.name}`,
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
        crumbs={[{ name: "Suites", path: "/suites/" }]}
        eyebrow={`Suites · ${site.address.street}`}
        title="Find your suite."
        intro={
          <>
            <Link href="/private-rooms/" className="font-semibold text-canvas underline decoration-canvas/40 underline-offset-4 hover:decoration-canvas">
              Private rooms
            </Link>{" "}
            on individual leases in Tower A,{" "}
            <Link href="/whole-suites/" className="font-semibold text-canvas underline decoration-canvas/40 underline-offset-4 hover:decoration-canvas">
              whole suites
            </Link>{" "}
            in Tower B. Prices come straight from our leasing system.
          </>
        }
      />
      <section className="py-14 lg:py-20">
        <div className="container">
          <SuitesBrowser suites={suites} initialTower={initialTower} />
        </div>
      </section>
      <JsonLd data={listSchema} />
    </>
  );
}
