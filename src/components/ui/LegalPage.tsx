import type { ReactNode } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { policiesUpdated } from "@/data/site";

/** Plain, readable layout for policy pages. */
export function LegalPage({ title, path, intro, children }: { title: string; path: string; intro: ReactNode; children: ReactNode }) {
  return (
    <>
      <PageHero crumbs={[{ name: title, path }]} eyebrow="Policies" title={title} intro={intro}>
        <p className="mt-6 text-sm text-canvas/70">Last updated {policiesUpdated}</p>
      </PageHero>
      <section className="py-16 lg:py-24">
        <div className="container">
          <article className="legal mx-auto max-w-3xl text-body text-brown">{children}</article>
        </div>
      </section>
    </>
  );
}
