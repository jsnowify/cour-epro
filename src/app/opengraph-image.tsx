import { ImageResponse } from "next/og";

/** Preview image when a page is shared (Discord, Facebook, X, search results): the preloader's look, crimson with the team name. */
export const alt = "COUR E-PRO, Mobile Legends esports team, Philippines";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#c8102e",
          color: "#ffffff",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, letterSpacing: 4, fontWeight: 700 }}>
          <span>MOBILE LEGENDS: BANG BANG</span>
          <span>PH SERVER</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 900, letterSpacing: -4, lineHeight: 1 }}>COUR E-PRO</div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 40, fontWeight: 700, color: "#0a0a0a" }}>Beyond the horizon. Beyond ourselves.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, letterSpacing: 3, fontWeight: 700 }}>
          <span>TRYOUTS OPEN · ALL FIVE LANES</span>
          <span>FOUNDED BY SNOWI</span>
        </div>
      </div>
    ),
    size,
  );
}
