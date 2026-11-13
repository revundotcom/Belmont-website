"use client";

import Image from "next/image";
import { useState } from "react";
import { Images } from "lucide-react";
import { Lightbox, type LightboxImage } from "@/components/media/Lightbox";
import { LogoMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

export function SuiteGallery({ images }: { images: LightboxImage[] }) {
  const [index, setIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/7] items-center justify-center rounded-[1.25rem] bg-seafoam/60">
        <LogoMark className="w-16 text-bell/50" />
      </div>
    );
  }

  const [hero, ...rest] = images;
  const side = rest.slice(0, 4);

  return (
    <>
      <div className="relative grid gap-2 sm:gap-3 md:grid-cols-4 md:grid-rows-2">
        <button
          type="button"
          onClick={() => setIndex(0)}
          className="group relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-seafoam/50 md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[30rem]"
          aria-label={`Open photo 1 of ${images.length}`}
        >
          <Image src={hero.src} alt={hero.alt} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        </button>
        {side.map((im, i) => (
          <button
            key={im.src}
            type="button"
            onClick={() => setIndex(i + 1)}
            className={cn("group relative hidden overflow-hidden bg-seafoam/50 md:block", i === 1 && "rounded-tr-[1.25rem]", i === 3 && "rounded-br-[1.25rem]", "rounded-md")}
            aria-label={`Open photo ${i + 2} of ${images.length}`}
          >
            <Image src={im.src} alt={im.alt} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIndex(0)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-canvas/95 px-4 py-2.5 text-sm font-semibold text-bell shadow-lg hover:bg-canvas"
        >
          <Images className="size-4" aria-hidden /> {images.length} photos
        </button>
      </div>
      <Lightbox images={images} index={index} onIndex={setIndex} onClose={() => setIndex(null)} />
    </>
  );
}
