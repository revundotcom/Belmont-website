import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow text-bell", className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  className,
  light = false,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
  light?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className={cn(light && "text-canvas/75")}>{eyebrow}</Eyebrow>}
      <h2 className={cn("type-h1 mt-4", light && "text-canvas")}>{title}</h2>
      {intro && (
        <>
          <span className={cn("rule-gold mt-6", align === "center" && "mx-auto")} aria-hidden />
          <div className={cn("mt-6 text-body-lg", light ? "text-canvas/85" : "text-brown")}>{intro}</div>
        </>
      )}
    </div>
  );
}

/** Image frame shaped like one arch of the mark. */
export function ArchFrame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("relative overflow-hidden rounded-arch", className)}>{children}</div>;
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
