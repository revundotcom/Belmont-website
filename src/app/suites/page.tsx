import type { Metadata } from "next";
import { SuitesBrowser } from "@/components/suites/SuitesBrowser";
import { Eyebrow } from "@/components/ui/primitives";
import { site } from "@/data/site";
import { getSuites } from "@/lib/bellmont";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Suites & Rooms for Rent",
  description:
    "Rooms and suites for rent at The Bellmont, 200 Old Carriage Drive, Kitchener: private rooms in Tower A and whole 3 and 4-bedroom suites in Tower B. Book a showing or apply online.",
  alternates: { canonical: "/suites/" },
};

export default async function SuitesPage({ searchParams }: { searchParams: Promise<{ tower?: string }> }) {
  const { tower } = await searchParams;
  const suites = await getSuites();
  const initialTower = tower === "A" || tower === "B" ? tower : "all";

  return (
    <>
      <section className="bg-bell text-canvas">
        <div className="container py-14 lg:py-20">
          <Eyebrow className="text-canvas/80">Suites · {site.address.street}</Eyebrow>
          <h1 className="type-display mt-5 max-w-3xl text-canvas">Find your suite.</h1>
          <p className="mt-6 max-w-2xl text-body-lg text-canvas/85">
            Private rooms on individual leases in Tower A, whole suites in Tower B. Prices come straight from our leasing system.
          </p>
        </div>
      </section>
      <section className="py-14 lg:py-20">
        <div className="container">
          <SuitesBrowser suites={suites} initialTower={initialTower} />
        </div>
      </section>
    </>
  );
}
