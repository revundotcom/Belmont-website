"use client";

import { useMemo, useState } from "react";
import { SuiteCard } from "./SuiteCard";
import type { Suite } from "@/lib/suite";
import { cn } from "@/lib/utils";

type TowerFilter = "all" | "A" | "B";
type SizeFilter = "all" | 3 | 4;

export function SuitesBrowser({ suites, initialTower = "all" }: { suites: Suite[]; initialTower?: TowerFilter }) {
  const [tower, setTower] = useState<TowerFilter>(initialTower);
  const [size, setSize] = useState<SizeFilter>("all");

  const counts = useMemo(
    () => ({
      all: suites.length,
      A: suites.filter((s) => s.tower === "A").length,
      B: suites.filter((s) => s.tower === "B").length,
    }),
    [suites],
  );
  const sizes = useMemo(
    () => Array.from(new Set(suites.map((s) => s.suiteBedrooms).filter((n): n is number => n != null))).sort(),
    [suites],
  );

  const visible = suites.filter((s) => (tower === "all" || s.tower === tower) && (size === "all" || s.suiteBedrooms === size));

  const towerOptions: { value: TowerFilter; label: string; hint?: string }[] = [
    { value: "all", label: `All listings (${counts.all})` },
    { value: "A", label: `Tower A · Private rooms (${counts.A})` },
    { value: "B", label: `Tower B · Whole suites (${counts.B})` },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by tower" className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
          {towerOptions
            .filter((o) => o.value === "all" || counts[o.value] > 0)
            .map((o) => (
              <Chip key={o.value} active={tower === o.value} onClick={() => setTower(o.value)}>
                {o.label}
              </Chip>
            ))}
        </div>
        {sizes.length > 1 && (
          <div role="group" aria-label="Filter by suite size" className="flex items-center gap-2">
            <span className="eyebrow mr-1 text-brown-muted">Suite size</span>
            <Chip active={size === "all"} onClick={() => setSize("all")}>
              Any
            </Chip>
            {sizes.map((n) => (
              <Chip key={n} active={size === n} onClick={() => setSize(n as SizeFilter)}>
                {n}-bed
              </Chip>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-brown-muted" aria-live="polite">
        Showing {visible.length} of {suites.length} listings
      </p>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-[1.25rem] border border-dashed border-grey p-10 text-center text-brown-muted">
          Nothing matches those filters right now. Try another tower or size.
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s, i) => (
            <li key={s.slug}>
              <SuiteCard suite={s} priority={i < 3} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active ? "border-bell bg-bell text-canvas" : "border-grey bg-canvas-soft text-brown hover:border-bell/60 hover:text-bell",
      )}
    >
      {children}
    </button>
  );
}
