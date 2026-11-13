"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";
import { Lightbox } from "@/components/media/Lightbox";
import type { BuildingPhoto } from "@/lib/bellmont";
import { cn } from "@/lib/utils";

/** A mosaic of building photos; any tile opens the full set. */
export function BuildingGallery({ photos }: { photos: BuildingPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;
  const tiles = photos.slice(0, 7);
  const spans = [
    "col-span-2 row-span-2 rounded-arch",
    "",
    "",
    "",
    "",
    "col-span-2",
    "col-span-2",
  ];

  return (
    <>
      <div className="grid auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4 lg:auto-rows-[14rem]">
        {tiles.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setIndex(i)}
            className={cn("group relative overflow-hidden rounded-2xl bg-seafoam/40", spans[i], i >= 5 && "hidden md:block")}
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            {i === tiles.length - 1 && photos.length > tiles.length && (
              <span className="absolute inset-0 flex items-center justify-center bg-teal/60 font-serif text-h3 text-canvas">
                +{photos.length - tiles.length} photos
              </span>
            )}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => setIndex(0)} className="btn-outline mt-6">
        <Expand className="size-4" aria-hidden /> View all {photos.length} photos
      </button>
      <Lightbox images={photos} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
