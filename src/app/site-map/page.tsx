import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { footerNav, legalNav } from "@/data/site";
import { getSuites } from "@/lib/bellmont";
import { pageMeta } from "@/lib/seo";
import type { Suite } from "@/lib/suite";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Sitemap",
  description: "Every page on The Bellmont website: rooms and suites for rent, amenities, gallery, neighbourhood, FAQ, contact and policies.",
  path: "/site-map/",
});

function SuiteLinks({ title, suites }: { title: string; suites: Suite[] }) {
  if (suites.length === 0) return null;
  return (
    <div>
      <h2 className="type-h3">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {suites.map((s) => (
          <li key={s.slug}>
            <Link href={`/suites/${s.slug}/`} className="link-plum font-normal">
              {s.title} · {s.floors ?? s.subtitle}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SiteMapPage() {
  const suites = await getSuites().catch(() => []);
  const sections = [{ title: "Home", links: [{ label: "Home", href: "/" }] }, ...footerNav, { title: "Policies", links: legalNav }];

  return (
    <>
      <PageHero crumbs={[{ name: "Sitemap", path: "/site-map/" }]} eyebrow="Sitemap" title="Every page, in one place." />
      <section className="py-20 lg:py-24">
        <div className="container grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((col) => (
            <div key={col.title}>
              <h2 className="type-h3">{col.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-plum font-normal">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="container mt-16 grid gap-12 border-t border-grey/60 pt-16 md:grid-cols-2">
          <SuiteLinks title="Tower A · Private rooms" suites={suites.filter((s) => s.tower === "A")} />
          <SuiteLinks title="Tower B · Whole suites" suites={suites.filter((s) => s.tower === "B")} />
        </div>
      </section>
    </>
  );
}
