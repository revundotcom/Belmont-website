"use client";

import { useMemo } from "react";
import { ArrowRight, CalendarCheck, Phone } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { useShowing } from "./ShowingProvider";
import { fallbackDates } from "./use-showing-slots";

/** Inline "pick a day" strip; a day opens the booking modal on that day. */
export function ShowingStrip() {
  const { dates, loading, hasSlots, open } = useShowing();
  const shown = useMemo(() => (hasSlots ? dates : fallbackDates()).slice(0, 6), [hasSlots, dates]);

  return (
    <div className="rounded-[1.25rem] border border-grey/60 bg-canvas-soft p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-bell">Showings</p>
          <h2 className="type-h2 mt-3">{!loading && !hasSlots ? "Request a showing" : "Book a showing"}</h2>
        </div>
        {!loading && hasSlots && (
          <p className="text-sm text-brown-muted">
            {dates.length} day{dates.length === 1 ? "" : "s"} with open times
          </p>
        )}
      </div>
      <div className="hide-scrollbar -mx-6 mt-6 flex gap-2.5 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 flex-[1_0_5rem] animate-pulse rounded-2xl bg-grey/30" />)
          : shown.map((d) => (
              <button
                key={d.date}
                type="button"
                onClick={() => open(d.date)}
                className="group flex h-24 flex-[1_0_5rem] flex-col items-center justify-center rounded-2xl border border-grey bg-canvas text-brown transition-colors hover:border-bell hover:bg-bell hover:text-canvas"
              >
                <span className="text-[0.6875rem] font-semibold tracking-[0.14em] text-brown-muted group-hover:text-canvas/80">{d.dayName}</span>
                <span className="font-serif text-[1.75rem] leading-tight">{d.dayNum}</span>
                <span className="text-xs text-brown-muted group-hover:text-canvas/80">{d.month}</span>
              </button>
            ))}
      </div>
      <button type="button" onClick={() => open()} className="link-plum mt-6 inline-flex items-center gap-1.5">
        See all times <ArrowRight className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export function ShowingButton({ className, label = "Book a showing" }: { className?: string; label?: string }) {
  const { open } = useShowing();
  return (
    <button type="button" onClick={() => open()} className={cn("btn-outline", className)}>
      <CalendarCheck className="size-4" aria-hidden /> {label}
    </button>
  );
}

/** Mobile bar: Apply Now + Book a showing, always in reach. */
export function MobileActionBar({ applyHref, priceLabel, priceUnit }: { applyHref: string; priceLabel: string; priceUnit: string }) {
  const { open } = useShowing();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-grey/60 bg-canvas/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <div className="mr-auto min-w-0">
          <p className="font-serif text-[1.375rem] leading-none text-bell">{priceLabel}</p>
          <p className="truncate text-[0.6875rem] text-brown-muted">{priceUnit.replace("/ month per room", "per room / mo").replace("/ month", "per month")}</p>
        </div>
        <button type="button" onClick={() => open()} className="btn-outline min-h-[2.75rem] shrink-0 whitespace-nowrap px-3.5 text-sm" aria-label="Book a showing">
          <CalendarCheck className="size-4" aria-hidden /> Showing
        </button>
        <a href={applyHref} className="btn-plum min-h-[2.75rem] shrink-0 whitespace-nowrap px-4 text-sm">
          Apply Now
        </a>
      </div>
    </div>
  );
}

export function CallLink({ className }: { className?: string }) {
  return (
    <a href={site.phoneHref} className={cn("inline-flex items-center gap-2 text-sm font-semibold text-bell hover:text-plum", className)}>
      <Phone className="size-4" aria-hidden /> {site.phone} · answered 24/7
    </a>
  );
}
