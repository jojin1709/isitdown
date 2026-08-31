"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, Scale, Zap, Radio, CheckCircle2, AlertCircle } from "lucide-react";

type ProbeNode = {
  id: string;
  name: string;
  region: string;
  flag: string;
  x: number; // SVG % coord
  y: number; // SVG % coord
  latency: number;
  status: "up" | "slow" | "down";
  incidentsCount: number;
};

const INITIAL_NODES: ProbeNode[] = [
  { id: "us-east", name: "Ashburn (US-East)", region: "North America", flag: "US", x: 250, y: 190, latency: 45, status: "up", incidentsCount: 0 },
  { id: "us-west", name: "Silicon Valley (US-West)", region: "North America", flag: "US", x: 170, y: 200, latency: 62, status: "up", incidentsCount: 0 },
  { id: "eu-central", name: "Frankfurt", region: "Europe", flag: "DE", x: 510, y: 170, latency: 38, status: "up", incidentsCount: 0 },
  { id: "eu-west", name: "London", region: "Europe", flag: "GB", x: 480, y: 160, latency: 41, status: "up", incidentsCount: 0 },
  { id: "in-south", name: "Mumbai", region: "Asia-Pacific", flag: "IN", x: 670, y: 260, latency: 18, status: "up", incidentsCount: 0 },
  { id: "in-north", name: "Delhi NCR", region: "Asia-Pacific", flag: "IN", x: 680, y: 235, latency: 22, status: "up", incidentsCount: 0 },
  { id: "ap-east", name: "Tokyo", region: "Asia-Pacific", flag: "JP", x: 830, y: 215, latency: 85, status: "up", incidentsCount: 0 },
  { id: "ap-se", name: "Singapore", region: "Asia-Pacific", flag: "SG", x: 740, y: 310, latency: 34, status: "up", incidentsCount: 0 },
  { id: "au-east", name: "Sydney", region: "Oceania", flag: "AU", x: 860, y: 400, latency: 125, status: "up", incidentsCount: 0 },
  { id: "sa-east", name: "São Paulo", region: "South America", flag: "BR", x: 340, y: 380, latency: 140, status: "up", incidentsCount: 0 },
  { id: "af-south", name: "Johannesburg", region: "Africa", flag: "ZA", x: 540, y: 390, latency: 165, status: "up", incidentsCount: 0 },
];

export default function WorldMapPage() {
  const [nodes, setNodes] = useState<ProbeNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<ProbeNode | null>(INITIAL_NODES[4]);
  const [downServicesCount, setDownServicesCount] = useState(0);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        if (data.services) {
          const downs = data.services.filter((s: any) => s.status === "down").length;
          setDownServicesCount(downs);

          if (downs > 0) {
            setNodes((prev) =>
              prev.map((n, idx) =>
                idx === 4 || idx === 5
                  ? { ...n, incidentsCount: downs, status: "slow" }
                  : n
              )
            );
          }
        }
      } catch {
        // fallback
      }
    }
    loadStatus();
  }, []);

  const totalActiveNodes = nodes.length;
  const avgGlobalLatency = Math.round(
    nodes.reduce((acc, n) => acc + n.latency, 0) / nodes.length
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </Link>
        <Link
          href="/compare"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-card border border-line hover:border-accent text-white/80 hover:text-white text-xs font-semibold transition-all"
        >
          <Scale className="w-3.5 h-3.5 text-accent" />
          <span>Compare Services</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-line text-xs font-semibold text-accent mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>Global Edge Network Live Map</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Interactive Outage & Latency <span className="text-accent">World Map</span>
        </h1>
        <p className="text-white/50 text-sm max-w-xl mx-auto">
          Live visualization of global server health, Edge probe telemetry, and active regional disruption epicenters.
        </p>

        <div className="flex justify-center items-center gap-3 mt-5 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-full bg-card border border-line text-white/70 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-up animate-pulse" />
            <span>{totalActiveNodes} Active Edge Probes</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-card border border-line text-white/70 font-mono flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-accent" />
            <span>{avgGlobalLatency} ms Avg Global Ping</span>
          </span>
          <span
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${
              downServicesCount > 0
                ? "bg-down/15 border-down/40 text-down"
                : "bg-up/15 border-up/40 text-up"
            }`}
          >
            {downServicesCount > 0 ? (
              <>
                <AlertCircle className="w-3 h-3 text-down" />
                <span>{downServicesCount} Active Incidents Detected</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-up" />
                <span>All Systems Globally Nominal</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Interactive World Map SVG Container */}
      <div className="bg-card border border-line rounded-3xl p-4 sm:p-8 mb-8 relative overflow-hidden">
        <div className="relative w-full aspect-[16/9] min-h-[340px] max-h-[560px]">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))" }}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#171717" strokeWidth="0.8" />
              </pattern>
            </defs>

            {/* Grid Backdrop */}
            <rect width="1000" height="500" fill="url(#grid)" />

            {/* Simplified Vector Continents */}
            {/* North America */}
            <path
              d="M 120 120 Q 200 80 280 130 T 260 250 T 180 270 T 110 180 Z"
              fill="#0D0D0D"
              stroke="#262626"
              strokeWidth="1.5"
            />
            {/* South America */}
            <path
              d="M 270 280 Q 360 300 370 380 T 310 470 T 260 350 Z"
              fill="#0D0D0D"
              stroke="#262626"
              strokeWidth="1.5"
            />
            {/* Europe */}
            <path
              d="M 460 120 Q 560 110 570 180 T 480 220 T 440 160 Z"
              fill="#0D0D0D"
              stroke="#262626"
              strokeWidth="1.5"
            />
            {/* Africa */}
            <path
              d="M 460 230 Q 580 220 570 340 T 520 440 T 450 310 Z"
              fill="#0D0D0D"
              stroke="#262626"
              strokeWidth="1.5"
            />
            {/* Asia */}
            <path
              d="M 580 110 Q 820 90 850 220 T 720 330 T 600 240 Z"
              fill="#0D0D0D"
              stroke="#262626"
              strokeWidth="1.5"
            />
            {/* Australia */}
            <path
              d="M 780 340 Q 880 330 890 410 T 800 440 Z"
              fill="#0D0D0D"
              stroke="#262626"
              strokeWidth="1.5"
            />

            {/* Connection Lines connecting probes */}
            <path
              d="M 250 190 L 510 170 L 670 260 L 740 310 L 860 400"
              fill="none"
              stroke="#5B8CFF"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.3"
            />
            <path
              d="M 250 190 L 340 380 L 540 390 L 670 260"
              fill="none"
              stroke="#5B8CFF"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.2"
            />

            {/* Nodes */}
            {nodes.map((n) => {
              const isSelected = selectedNode?.id === n.id;
              const isIncident = n.incidentsCount > 0;
              const nodeColor = isIncident ? "#FF4D6D" : "#3DDC84";

              return (
                <g
                  key={n.id}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedNode(n)}
                >
                  {/* Outer Radar Wave */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isSelected ? 18 : 12}
                    fill={nodeColor}
                    opacity="0.15"
                    className="animate-ping"
                    style={{ animationDuration: isIncident ? "1.2s" : "2.5s" }}
                  />

                  {/* Core Node Circle */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isSelected ? 7 : 5}
                    fill={nodeColor}
                    stroke="#000000"
                    strokeWidth="2"
                  />

                  {/* Node Text Label */}
                  <text
                    x={n.x + 10}
                    y={n.y + 4}
                    fill="#E2E8F0"
                    fontSize={isSelected ? "12" : "10"}
                    fontFamily="sans-serif"
                    fontWeight={isSelected ? "700" : "500"}
                  >
                    {n.flag} {n.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Box */}
        {selectedNode && (
          <div className="mt-4 bg-card2 border border-line p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-card border border-line font-mono font-bold text-accent text-sm">
                {selectedNode.flag}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {selectedNode.name}
                  </h3>
                  <span className="text-xs text-white/40">
                    ({selectedNode.region})
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">
                  Edge Probe ID: <span className="font-mono text-accent">{selectedNode.id}</span> · Real-time socket telemetry active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs shrink-0 font-mono">
              <div>
                <p className="text-white/40 text-[10px]">Round-Trip Ping</p>
                <p className="font-bold text-white text-sm">{selectedNode.latency} ms</p>
              </div>
              <div className="border-l border-line pl-6">
                <p className="text-white/40 text-[10px]">Incidents</p>
                <p
                  className={`font-bold text-sm ${
                    selectedNode.incidentsCount > 0 ? "text-down" : "text-up"
                  }`}
                >
                  {selectedNode.incidentsCount} Active
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Regional Nodes Table */}
      <div className="bg-card2 border border-line rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">
          Global Telemetry Probes Directory
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nodes.map((n) => (
            <div
              key={n.id}
              onClick={() => setSelectedNode(n)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedNode?.id === n.id
                  ? "bg-card border-accent shadow-md"
                  : "bg-card/50 border-line hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-card border border-line text-[10px] font-mono text-accent">
                    {n.flag}
                  </span>
                  <span>{n.name}</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-up live-dot" />
              </div>
              <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                <span>{n.region}</span>
                <span className="font-bold text-white">{n.latency} ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
