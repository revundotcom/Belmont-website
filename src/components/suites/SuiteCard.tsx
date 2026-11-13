import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import type { Suite } from "@/lib/suite";

export function SuiteCard({ suite, priority = false }: { suite: Suite; priority?: boolean }) {
  return (
    <Link
      href={`/suites/${suite.slug}/`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-grey/50 bg-canvas-soft transition-all duration-300 hover:-translate-y-1 hover:border-bell/40 hover:shadow-[0_24px_48px_-28px_rgba(26,51,56,0.55)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-seafoam/50">
        {suite.image ? (
          <Image
            src={suite.image}
            alt={`${suite.title}, ${suite.subtitle}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <LogoMark className="w-14 text-bell/40" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {suite.tower && (
            <span className="eyebrow rounded-full bg-bell px-3 py-1.5 text-[0.6875rem] text-canvas">Tower {suite.tower}</span>
          )}
          <span className="eyebrow rounded-full bg-canvas/95 px-3 py-1.5 text-[0.6875rem] text-bell">
            {suite.arrangement === "room" ? "Private room" : "Whole suite"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow text-bell/80">{suite.floors ?? "The Bellmont"}</p>
        <h3 className="type-h3 mt-2 text-bell">{suite.title}</h3>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-brown-muted">
          {suite.suiteBedrooms != null && (
            <li className="inline-flex items-center gap-1.5">
              <BedDouble className="size-4 text-bell" aria-hidden />
              {suite.arrangement === "room" ? `1 of ${suite.suiteBedrooms} bedrooms` : `${suite.suiteBedrooms} bedrooms`}
            </li>
          )}
          {suite.bathrooms != null && (
            <li className="inline-flex items-center gap-1.5">
              <Bath className="size-4 text-bell" aria-hidden />
              {suite.bathrooms} {suite.arrangement === "room" ? "shared " : ""}bath{suite.bathrooms === 1 ? "" : "s"}
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-grey/40 pt-5">
          <div>
            <p className="font-serif text-[1.75rem] leading-none text-bell" style={{ fontVariationSettings: '"opsz" 72' }}>
              {suite.priceLabel}
            </p>
            <p className="mt-1.5 text-xs text-brown-muted">{suite.priceUnit}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-plum">
              View suite <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
