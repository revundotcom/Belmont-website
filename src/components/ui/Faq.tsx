import { Plus } from "lucide-react";

export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-grey/60 border-y border-grey/60">
      {items.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <span className="font-serif text-[1.25rem] leading-snug text-bell" style={{ fontVariationSettings: '"opsz" 36' }}>
              {f.q}
            </span>
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-grey text-bell transition-transform duration-300 group-open:rotate-45 group-open:border-bell">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 pr-12 text-body text-brown">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
