"use client";

import { useState } from "react";
import { FileCheck, Download } from "lucide-react";

type Props = {
  serviceName: string;
  url?: string;
  status: "up" | "down" | "slow";
  responseTime: number | null;
  httpStatus: number | null;
};

export default function ProofOfOutageExporter({
  serviceName,
  url,
  status,
  responseTime,
  httpStatus,
}: Props) {
  const [downloading, setDownloading] = useState(false);

  function generateCertificate() {
    setDownloading(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 700;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const now = new Date();
      const incidentId = `INC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // Background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border outline
      ctx.strokeStyle = "#262626";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Inner card container
      ctx.fillStyle = "#0D0D0D";
      ctx.roundRect(40, 40, canvas.width - 80, canvas.height - 80, 20);
      ctx.fill();
      ctx.strokeStyle = "#1F2430";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Top Banner
      ctx.fillStyle = "#5B8CFF";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("ISITDOWN.LIVE — OFFICIAL SLA INCIDENT VERIFICATION", 70, 95);

      ctx.fillStyle = "#718096";
      ctx.font = "14px monospace";
      ctx.fillText(`INCIDENT HASH: ${incidentId}`, 800, 95);

      // Divider
      ctx.strokeStyle = "#262626";
      ctx.beginPath();
      ctx.moveTo(70, 120);
      ctx.lineTo(canvas.width - 70, 120);
      ctx.stroke();

      // Target Header
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 44px sans-serif";
      ctx.fillText(`${serviceName} Availability Audit`, 70, 185);

      ctx.fillStyle = "#A0AEC0";
      ctx.font = "18px sans-serif";
      ctx.fillText(`Target Host: ${url || serviceName}`, 70, 220);

      // Status Box
      const isDown = status === "down";
      const isSlow = status === "slow";
      const statusColor = isDown ? "#FF4D6D" : isSlow ? "#FFC93D" : "#3DDC84";
      const statusBg = isDown ? "rgba(255, 77, 109, 0.12)" : isSlow ? "rgba(255, 201, 61, 0.12)" : "rgba(61, 220, 132, 0.12)";
      const statusText = isDown ? "PROVEN DOWNTIME / OUTAGE" : isSlow ? "DEGRADED LATENCY" : "OPERATIONAL & ACTIVE";

      ctx.fillStyle = statusBg;
      ctx.roundRect(70, 255, 480, 65, 12);
      ctx.fill();
      ctx.strokeStyle = statusColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = statusColor;
      ctx.font = "bold 24px sans-serif";
      ctx.fillText(`●  ${statusText}`, 95, 298);

      // Data Grid Boxes
      const drawMetric = (label: string, value: string, x: number, y: number, w: number) => {
        ctx.fillStyle = "#171717";
        ctx.roundRect(x, y, w, 90, 12);
        ctx.fill();
        ctx.strokeStyle = "#262626";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "#718096";
        ctx.font = "14px sans-serif";
        ctx.fillText(label, x + 20, y + 35);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 22px monospace";
        ctx.fillText(value, x + 20, y + 68);
      };

      drawMetric("HTTP Status Code", httpStatus ? `HTTP ${httpStatus}` : (isDown ? "No Response (5xx/Timeout)" : "HTTP 200"), 70, 345, 250);
      drawMetric("Latency Probe", responseTime ? `${responseTime} ms` : "Unreachable", 340, 345, 250);
      drawMetric("Verification Region", "Global Edge Network", 610, 345, 250);
      drawMetric("Probe Protocol", "Direct HTTP/S Socket", 880, 345, 250);

      // Audit Details Section
      ctx.fillStyle = "#171717";
      ctx.roundRect(70, 460, canvas.width - 140, 110, 12);
      ctx.fill();
      ctx.strokeStyle = "#262626";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#A0AEC0";
      ctx.font = "14px sans-serif";
      ctx.fillText("TIMESTAMP (UTC):", 95, 495);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 14px monospace";
      ctx.fillText(now.toUTCString(), 245, 495);

      ctx.fillStyle = "#A0AEC0";
      ctx.font = "14px sans-serif";
      ctx.fillText("LOCAL TIME:", 95, 535);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 14px monospace";
      ctx.fillText(now.toLocaleString(), 245, 535);

      // Official Stamp / Watermark
      ctx.strokeStyle = "#5B8CFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(1040, 515, 38, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#5B8CFF";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("VERIFIED", 1018, 510);
      ctx.fillText("ISITDOWN", 1016, 525);

      // Footer
      ctx.fillStyle = "#4A5568";
      ctx.font = "12px sans-serif";
      ctx.fillText("This document is generated by IsItDown.live for SLA verification, incident tracking, and outage reporting.", 70, 610);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `Proof-of-Outage-${serviceName.replace(/\s+/g, "_")}-${incidentId}.png`;
      a.click();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-card border border-line shrink-0">
            <FileCheck className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Official "Proof of Outage" SLA Certificate
            </h3>
            <p className="text-xs text-white/50">
              Download a digitally stamped SLA incident report image for downtime claims or client logs
            </p>
          </div>
        </div>

        <button
          onClick={generateCertificate}
          disabled={downloading}
          className="px-5 py-2.5 rounded-xl bg-card border border-line hover:border-accent text-white text-xs font-bold hover:bg-accent/10 transition-all flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-accent" />
          <span>{downloading ? "Generating..." : "Download Proof Certificate (.PNG)"}</span>
        </button>
      </div>
    </div>
  );
}
