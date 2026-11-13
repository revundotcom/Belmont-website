import { lockup, wordmark, wordmarkAlt, mark } from "./logo-paths";
import { cn } from "@/lib/utils";

/**
 * The Bellmont logo family, drawn from the supplied artwork (never retyped).
 *
 * Colourways allowed by the guidelines (slide 05):
 *   Bell Blue on Canvas · Bell Blue on Seafoam · Brown on Canvas
 *   Canvas on Bell Blue · Canvas on Teal · Canvas on Brown
 * Pass the colour through `className` (text-bell, text-canvas, text-brown).
 *
 * Minimum screen widths (slide 03): Lockup 160px · Wordmark 140px ·
 * Wordmark Alt 120px · Mark 24px.
 */
type Shape = typeof lockup;

function Svg({ shape, title, className }: { shape: Shape; title: string; className?: string }) {
  const [, , w, h] = shape.viewBox.split(" ").map(Number);
  return (
    <svg
      viewBox={shape.viewBox}
      fill="currentColor"
      role="img"
      aria-label={title}
      className={cn("block h-auto shrink-0", className)}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <title>{title}</title>
      {shape.paths.map((p, i) => (
        <path key={i} d={p.d} fillRule={p.rule} />
      ))}
    </svg>
  );
}

/** Primary signature: two-arch mark beside the spaced wordmark. */
export function LogoLockup({ className }: { className?: string }) {
  return <Svg shape={lockup} title="The Bellmont" className={cn("min-w-[160px]", className)} />;
}

/** When the mark appears elsewhere on the piece. */
export function LogoWordmark({ className }: { className?: string }) {
  return <Svg shape={wordmark} title="The Bellmont" className={cn("min-w-[140px]", className)} />;
}

/** Narrow spaces, headers and footers. */
export function LogoWordmarkAlt({ className }: { className?: string }) {
  return <Svg shape={wordmarkAlt} title="The Bellmont" className={cn("min-w-[120px]", className)} />;
}

/** Favicons and details. Decorative by default. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  if (!title) {
    const [, , w, h] = mark.viewBox.split(" ").map(Number);
    return (
      <svg
        viewBox={mark.viewBox}
        fill="currentColor"
        aria-hidden="true"
        className={cn("block h-auto min-w-[24px] shrink-0", className)}
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        {mark.paths.map((p, i) => (
          <path key={i} d={p.d} fillRule={p.rule} />
        ))}
      </svg>
    );
  }
  return <Svg shape={mark} title={title} className={cn("min-w-[24px]", className)} />;
}
