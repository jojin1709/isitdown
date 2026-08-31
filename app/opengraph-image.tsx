import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "IsItDown - Live Website Availability & Uptime Monitor";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B0E14",
          backgroundImage: "radial-gradient(circle at 25px 25px, #1A1F2C 2%, transparent 0%), radial-gradient(circle at 75px 75px, #131722 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#5B8CFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              ⚡
            </div>
            <span style={{ fontSize: "28px", fontWeight: "800" }}>
              IsItDown<span style={{ color: "#5B8CFF" }}>.live</span>
            </span>
          </div>

          <div
            style={{
              backgroundColor: "rgba(61, 220, 132, 0.15)",
              border: "1px solid rgba(61, 220, 132, 0.4)",
              padding: "8px 20px",
              borderRadius: "30px",
              fontSize: "16px",
              color: "#3DDC84",
              fontWeight: "700",
            }}
          >
            ● 40+ Global Services Monitored
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "60px",
              fontWeight: "900",
              letterSpacing: "-1px",
              lineHeight: 1.1,
            }}
          >
            Is it <span style={{ color: "#FF4D6D" }}>down</span>, or just you?
          </div>
          <div style={{ fontSize: "24px", color: "#94A3B8", maxWidth: "800px" }}>
            Real-time HTTP health, SSL certificate verification, and latency benchmarks for popular platforms and custom domains.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #242A38",
            paddingTop: "24px",
            fontSize: "16px",
            color: "#64748B",
          }}
        >
          <span>Developed by Jojin John</span>
          <span>https://isitdown-live.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
