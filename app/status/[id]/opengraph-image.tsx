import { ImageResponse } from "next/og";
import { SERVICES } from "@/lib/services";
import { checkUrl } from "@/lib/checker";

export const runtime = "edge";
export const alt = "IsItDown Live Status Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const service = SERVICES.find((s) => s.id === params.id);
  const name = service?.name || params.id;
  const category = service?.category || "Platform";

  let status = "OPERATIONAL";
  let statusBg = "rgba(61, 220, 132, 0.15)";
  let statusBorder = "rgba(61, 220, 132, 0.4)";
  let statusColor = "#3DDC84";
  let latencyText = "Active & Monitored";

  try {
    if (service?.url) {
      const res = await checkUrl(service.url);
      if (res.status === "down") {
        status = "DOWN / OUTAGE";
        statusBg = "rgba(255, 77, 109, 0.15)";
        statusBorder = "rgba(255, 77, 109, 0.4)";
        statusColor = "#FF4D6D";
        latencyText = "Unreachable";
      } else if (res.status === "slow") {
        status = "SLOW RESPONSE";
        statusBg = "rgba(255, 201, 61, 0.15)";
        statusBorder = "rgba(255, 201, 61, 0.4)";
        statusColor = "#FFC93D";
        latencyText = `${res.responseTime}ms`;
      } else if (res.responseTime) {
        latencyText = `${res.responseTime}ms Latency`;
      }
    }
  } catch {
    // fallback
  }

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
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
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
            <span
              style={{
                fontSize: "28px",
                fontWeight: "800",
                letterSpacing: "-0.5px",
              }}
            >
              IsItDown<span style={{ color: "#5B8CFF" }}>.live</span>
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#131722",
              border: "1px solid #242A38",
              padding: "8px 20px",
              borderRadius: "30px",
              fontSize: "16px",
              color: "#94A3B8",
            }}
          >
            <span>Live Health Monitor</span>
          </div>
        </div>

        {/* Center Main Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "#5B8CFF",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {category} Availability Check
          </div>

          <div
            style={{
              fontSize: "64px",
              fontWeight: "900",
              letterSpacing: "-1px",
            }}
          >
            Is {name} Down?
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: statusBg,
                border: `2px solid ${statusBorder}`,
                padding: "12px 28px",
                borderRadius: "16px",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: statusColor,
                }}
              />
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: "800",
                  color: statusColor,
                }}
              >
                {status}
              </span>
            </div>

            <div
              style={{
                backgroundColor: "#131722",
                border: "1px solid #242A38",
                padding: "14px 24px",
                borderRadius: "16px",
                fontSize: "22px",
                fontWeight: "600",
                color: "#E2E8F0",
              }}
            >
              {latencyText}
            </div>
          </div>
        </div>

        {/* Footer */}
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
          <span>Real-time server-to-server HTTP & SSL probe diagnostics</span>
          <span>isitdown-live.vercel.app/status/{params.id}</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
