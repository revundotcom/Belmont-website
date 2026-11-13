import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/ui/primitives";
import { breadcrumbSchema, type Crumb } from "@/lib/seo";

/** Bell Blue page header with visible breadcrumbs + BreadcrumbList schema. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  children,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="bg-bell text-canvas">
      <div className="container pb-14 pt-8 lg:pb-20 lg:pt-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-canvas/75">
            <li>
              <Link href="/" className="hover:text-canvas">
                Home
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5" aria-hidden />
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-canvas">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="hover:text-canvas">
                    {c.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow mt-10 text-canvas/80">{eyebrow}</p>
        <h1 className="type-display mt-5 max-w-4xl text-canvas">{title}</h1>
        {intro && <div className="mt-6 max-w-2xl text-body-lg text-canvas/85">{intro}</div>}
        {children}
      </div>
      <JsonLd data={breadcrumbSchema(crumbs)} />
    </section>
  );
}
