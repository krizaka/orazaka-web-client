import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION } from "@/app/_seo/seo";

export const alt = "Orazaka — the AI that never leaves home";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The social preview of every page: the name on Orazaka's orange, one line. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(circle at 80% 20%, #b45309 0%, #0c0a09 55%), #0c0a09",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 104, fontWeight: 900, letterSpacing: -2 }}>
          {SITE_NAME.toUpperCase()}
          <span style={{ color: "#fb923c" }}>.</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 40, fontWeight: 600, maxWidth: 960, lineHeight: 1.25 }}>{SITE_DESCRIPTION}</div>
        <div style={{ marginTop: "auto", fontSize: 24, color: "#a1a1aa" }}>dev.orazaka.com · A Krizaka product</div>
      </div>
    ),
    size,
  );
}
