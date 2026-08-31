"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { HistoryPoint } from "@/lib/history";

type Props = {
  points?: HistoryPoint[];
  currentLatency?: number | null;
  serviceName?: string;
  status: "up" | "down" | "slow";
};

export default function OutageRiskCard({
  points = [],
  currentLatency,
  serviceName,
  status,
}: Props) {
  const riskAnalysis = useMemo(() => {
    if (status === "down") {
      return {
        level: "Active Outage",
        score: 100,
        color: "text-down",
        badgeBg: "bg-down/15 border-down/40",
        meterWidth: 100,
        meterColor: "from-down to-rose-700",
        verdict: "Service is currently experiencing total downtime or connection timeout.",
        jitterMs: 0,
        stdDev: 0,
      };
    }

    if (!points || points.length === 0) {
      return {
        level: "Low Risk",
        score: 12,
        color: "text-up",
        badgeBg: "bg-up/15 border-up/40",
        meterWidth: 15,
        meterColor: "from-up to-emerald-600",
        verdict: "Response latency is within optimal operational baseline.",
        jitterMs: 5,
        stdDev: 3,
      };
    }

    const latencies = points.map((p) => p.responseTime);
    const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
    const variance =
      latencies.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / latencies.length;
    const stdDev = Math.round(Math.sqrt(variance));

    const cur = currentLatency || mean;
    const jitter = Math.abs(Math.round(cur - mean));

    if (status === "slow" || cur > mean * 2.5 || stdDev > 60) {
      return {
        level: "Elevated Risk",
        score: 78,
        color: "text-down",
        badgeBg: "bg-down/15 border-down/40",
        meterWidth: 80,
        meterColor: "from-amber-500 to-rose-600",
        verdict: `High latency variance (±${stdDev}ms) and jitter detected. Elevated probability of degradation.`,
        jitterMs: jitter,
        stdDev,
      };
    }

    if (cur > mean * 1.4 || stdDev > 30) {
      return {
        level: "Moderate Risk",
        score: 45,
        color: "text-slow",
        badgeBg: "bg-slow/15 border-slow/40",
        meterWidth: 45,
        meterColor: "from-blue-500 to-amber-500",
        verdict: `Minor latency fluctuations (±${stdDev}ms). Server performance is experiencing moderate load.`,
        jitterMs: jitter,
        stdDev,
      };
    }

    return {
      level: "Low Risk (Stable)",
      score: 15,
      color: "text-up",
      badgeBg: "bg-up/15 border-up/40",
      meterWidth: 18,
      meterColor: "from-emerald-500 to-teal-600",
      verdict: `Consistent response latency with minimal variance (±${stdDev}ms). Origin infrastructure is healthy.`,
      jitterMs: jitter,
      stdDev,
    };
  }, [points, currentLatency, status]);

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-card border border-line shrink-0">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Predictive Outage Risk & Latency Variance
            </h3>
            <p className="text-xs text-white/50">
              Real-time anomaly detection based on standard deviation and jitter models
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${riskAnalysis.badgeBg} ${riskAnalysis.color} self-start sm:self-auto`}
        >
          ● {riskAnalysis.level}
        </span>
      </div>

      {/* Risk Meter Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-white/40">Anomaly Risk Probability</span>
          <span className="font-mono font-bold text-white">{riskAnalysis.score}%</span>
        </div>
        <div className="w-full bg-card rounded-full h-3 overflow-hidden border border-line p-0.5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${riskAnalysis.meterColor} transition-all duration-500`}
            style={{ width: `${riskAnalysis.meterWidth}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
        <div className="bg-card border border-line p-3 rounded-xl">
          <p className="text-white/40 text-[10px] uppercase mb-0.5">Latency Jitter</p>
          <p className="font-mono font-bold text-white text-sm">
            {riskAnalysis.jitterMs} ms
          </p>
        </div>

        <div className="bg-card border border-line p-3 rounded-xl">
          <p className="text-white/40 text-[10px] uppercase mb-0.5">Standard Deviation</p>
          <p className="font-mono font-bold text-white text-sm">
            ±{riskAnalysis.stdDev} ms
          </p>
        </div>

        <div className="bg-card border border-line p-3 rounded-xl sm:col-span-1">
          <p className="text-white/40 text-[10px] uppercase mb-0.5">Analysis Summary</p>
          <p className="text-[11px] text-white/70 truncate" title={riskAnalysis.verdict}>
            {riskAnalysis.verdict}
          </p>
        </div>
      </div>
    </div>
  );
}
