import { ImageResponse } from "next/og";
import { mark } from "@/components/brand/logo-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the mark in Canvas on Bell Blue. */
export default function AppleIcon() {
  const paths = mark.paths.map((p) => `<path fill-rule="${p.rule}" d="${p.d}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mark.viewBox}" fill="#F1E8DD">${paths}</svg>`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2F5D66" }}>
        <img src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} width={100} height={100} alt="" />
      </div>
    ),
    size,
  );
}
