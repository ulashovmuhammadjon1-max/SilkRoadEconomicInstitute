import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "./site";

export const ogSize = { width: 1200, height: 630 };

// Source Serif 4 SemiBold (SIL Open Font License; see assets/fonts/LICENSE).
const serif = fs.readFileSync(path.join(process.cwd(), "assets/fonts/source-serif-4-latin-600-normal.woff"));

/** Shared editorial Open Graph card: cream paper, navy serif title, gold route line. */
export function ogImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer?: string }) {
  const fontSize = title.length > 110 ? 50 : title.length > 70 ? 60 : 76;
  const dots = Array.from({ length: 70 }, (_, i) => i);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#F5EFE3", color: "#1B2A4A", padding: "64px 80px", fontFamily: "Serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "Serif", fontSize: 24, color: "#7A5F28", letterSpacing: 4, textTransform: "uppercase" }}>
          <span>{eyebrow}</span>
          <span style={{ color: "#5B6475" }}>SREI</span>
        </div>
        <div style={{ display: "flex", height: 3, background: "#1B2A4A", marginTop: 20 }} />
        <div style={{ display: "flex", flex: 1, alignItems: "center", fontSize, lineHeight: 1.12, letterSpacing: -1, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 26 }}>
          {dots.map((i) => (
            <div key={i} style={{ width: i % 17 === 8 ? 12 : 4, height: i % 17 === 8 ? 12 : 4, borderRadius: 99, background: "#B8964F", marginRight: 11, marginTop: Math.round(Math.sin(i / 6) * 10) }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#1B2A4A" }}>
          <span>{site.name}</span>
          <span style={{ color: "#7A5F28" }}>{footer ?? "silkroadecon.asia"}</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: "Serif", data: serif, weight: 600, style: "normal" }] },
  );
}
