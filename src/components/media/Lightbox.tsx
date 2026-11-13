"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
}

export function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: LightboxImage[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      onIndex((index + d + images.length) % images.length);
    },
    [index, images.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, go, onClose]);

  if (!open || typeof document === "undefined") return null;
  const img = images[index];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[100] flex animate-fade-in flex-col bg-teal/95 text-canvas backdrop-blur-sm"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="eyebrow text-canvas/80">
          {index + 1} / {images.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-canvas/10"
          aria-label="Close photo viewer"
        >
          <X className="size-6" />
        </button>
      </div>
      <div className="relative flex-1" onClick={onClose}>
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          sizes="100vw"
          className="animate-fade-in object-contain px-2 sm:px-20"
          onClick={(e) => e.stopPropagation()}
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/10 hover:bg-canvas/20 sm:inline-flex"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full bg-canvas/10 hover:bg-canvas/20 sm:inline-flex"
              aria-label="Next photo"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>
      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 py-4 sm:justify-center sm:px-6">
        {images.map((im, i) => (
          <button
            key={im.src}
            type="button"
            onClick={() => onIndex(i)}
            className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md transition-opacity ${i === index ? "ring-2 ring-canvas" : "opacity-50 hover:opacity-90"}`}
            aria-label={`Show photo ${i + 1}`}
            aria-current={i === index}
          >
            <Image src={im.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
