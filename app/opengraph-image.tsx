import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Torny AI — Your 24/7 Philippine Legal Assistant";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const avatarData = await readFile(join(process.cwd(), "public/IMG_0461.jpeg"));
  const avatarSrc = `data:image/jpeg;base64,${avatarData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #0e1f44 0%, #1e3a7b 60%, #162d60 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Philippine flag stripe at top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, display: "flex" }}>
          <div style={{ flex: 1, background: "#0038a8" }} />
          <div style={{ flex: 1, background: "#fcd116" }} />
          <div style={{ flex: 1, background: "#ce1126" }} />
        </div>

        {/* Content row */}
        <div style={{ display: "flex", alignItems: "center", gap: 64, padding: "0 80px" }}>
          {/* Avatar */}
          <div
            style={{
              width: 230,
              height: 230,
              borderRadius: "50%",
              overflow: "hidden",
              border: "6px solid #fcd116",
              flexShrink: 0,
              display: "flex",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarSrc} alt="Torny" width={230} height={230} style={{ objectFit: "cover" }} />
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ color: "white", fontSize: 72, fontWeight: 900, letterSpacing: "-1px" }}>
                Torny
              </span>
              <span style={{ color: "#fcd116", fontSize: 72, fontWeight: 900, letterSpacing: "-1px" }}>
                AI
              </span>
            </div>
            <p style={{ color: "#bfdbfe", fontSize: 28, margin: 0, lineHeight: 1.4 }}>
              Your 24/7 Philippine Legal Assistant
            </p>
            <p style={{ color: "#93c5fd", fontSize: 21, margin: 0, lineHeight: 1.5, maxWidth: 540 }}>
              Free legal information on Family, Labor, Criminal &amp; Property law — in English &amp; Filipino.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
              {["⚡ 24/7 Free*", "🔒 Confidential", "📚 Philippine Law"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "#bfdbfe",
                    padding: "6px 18px",
                    borderRadius: 999,
                    fontSize: 17,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 48,
            color: "#fcd116",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          torny.online
        </div>
      </div>
    ),
    { ...size }
  );
}
