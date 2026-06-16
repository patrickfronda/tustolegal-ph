import { ImageResponse } from "next/og";

export const alt = "Torny.ai — Libreng Legal na Gabay para sa Bawat Pilipino";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a7b 0%, #0e2456 100%)",
          position: "relative",
        }}
      >
        {/* Top flag stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(to right, #0038a8, #fcd116, #ce1126)",
            display: "flex",
          }}
        />

        {/* Bottom flag stripe */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "linear-gradient(to right, #0038a8, #fcd116, #ce1126)",
            display: "flex",
          }}
        />

        {/* Logo circle */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "#fcd116",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            fontSize: 52,
          }}
        >
          ⚖️
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 0,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-2px",
            }}
          >
            Torny
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#fcd116",
              letterSpacing: "-2px",
            }}
          >
            .ai
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#93c5fd",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Libreng Legal na Gabay para sa Bawat Pilipino
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: 22,
            color: "#60a5fa",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          Family · Labor · Criminal · Property · Civil Law
        </div>

        {/* Badge */}
        <div
          style={{
            marginTop: 40,
            background: "rgba(252, 209, 22, 0.15)",
            border: "2px solid rgba(252, 209, 22, 0.4)",
            borderRadius: 50,
            padding: "10px 28px",
            display: "flex",
          }}
        >
          <span style={{ fontSize: 18, color: "#fcd116" }}>
            🆓 Libre · Batay sa Batas ng Pilipinas
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
