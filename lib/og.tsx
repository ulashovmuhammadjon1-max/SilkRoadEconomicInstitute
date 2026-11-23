import { ImageResponse } from "next/og";
import { site } from "./site";

export const ogSize = { width: 1200, height: 630 };

/** Shared branded Open Graph card (navy, cream, gold) used by every page. */
export function ogImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  const fontSize = title.length > 110 ? 46 : title.length > 70 ? 56 : 68;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1B2A4A",
          color: "#F5EFE3",
          padding: "72px 80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#D4BC86" }}>
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize, lineHeight: 1.15, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 2, width: 160, background: "#B8964F", marginBottom: 24 }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#F5EFE3" }}>
            <span>{site.name}</span>
            <span style={{ color: "#D4BC86" }}>{footer ?? "silkroadecon.asia"}</span>
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
