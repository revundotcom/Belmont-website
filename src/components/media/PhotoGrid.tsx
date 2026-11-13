"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxImage } from "./Lightbox";

/** Every photo as an even grid; any photo opens the viewer. */
export function PhotoGrid({ photos }: { photos: LightboxImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-seafoam/40"
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
            >
              <Image src={p.src} alt={p.alt} fill loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={photos} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
