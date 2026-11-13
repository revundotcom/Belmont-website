import { ImageResponse } from "next/og";
import { lockup, mark } from "@/components/brand/logo-paths";

export const alt = "The Bellmont — rooms & suites for rent at 200 Old Carriage Drive, Kitchener";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function svgUri(shape: typeof lockup, color: string) {
  const paths = shape.paths.map((p) => `<path fill-rule="${p.rule}" d="${p.d}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${shape.viewBox}" fill="${color}">${paths}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Share card: Canvas lockup on a Bell Blue field, the brand's primary colourway. */
export default function OpengraphImage() {
  const [, , lw, lh] = lockup.viewBox.split(" ").map(Number);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#2F5D66", padding: 80 }}>
        <img src={svgUri(lockup, "#F1E8DD")} width={620} height={(620 * lh) / lw} alt="" />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", color: "#F1E8DD" }}>
            <div style={{ fontSize: 52, lineHeight: 1.15 }}>Two buildings. One community.</div>
            <div style={{ width: 96, height: 2, background: "#B39764", margin: "32px 0" }} />
            <div style={{ fontSize: 30, opacity: 0.85 }}>Rooms & suites for rent · 200 Old Carriage Drive, Kitchener</div>
          </div>
          <img src={svgUri(mark, "#B5C6C9")} width={150} height={150} alt="" />
        </div>
      </div>
    ),
    size,
  );
}
