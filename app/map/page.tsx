"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Globe, Scale, Zap, Radio, CheckCircle2, AlertCircle } from "lucide-react";
import { getRealWorldMapPaths, PROBE_CITIES, CityNode } from "@/lib/worldMapData";

export default function WorldMapPage() {
  const [nodes, setNodes] = useState<(CityNode & { x: number; y: number })[]>([]);
  const [selectedNode, setSelectedNode] = useState<(CityNode & { x: number; y: number }) | null>(null);
  const [downServicesCount, setDownServicesCount] = useState(0);

  const mapData = useMemo(() => {
    return getRealWorldMapPaths(960, 500);
  }, []);

  useEffect(() => {
    setNodes(mapData.projectedNodes);
    setSelectedNode(mapData.projectedNodes[4]); // Default to Mumbai

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
  }, [mapData]);

  const totalActiveNodes = nodes.length;
  const avgGlobalLatency = Math.round(
    nodes.reduce((acc, n) => acc + n.latency, 0) / (nodes.length || 1)
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
          <span>Global Edge Network Live Telemetry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Real-Time Global Outage & Latency <span className="text-accent">World Map</span>
        </h1>
        <p className="text-white/50 text-sm max-w-xl mx-auto">
          Geographically accurate natural Earth projection tracking active global connectivity nodes, latency jitter, and regional outage epicenters.
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

      {/* Realistic GeoJSON SVG Map Canvas */}
      <div className="bg-card border border-line rounded-3xl p-4 sm:p-6 mb-8 relative overflow-hidden shadow-2xl">
        <div className="relative w-full aspect-[1.92/1] min-h-[360px]">
          <svg
            viewBox="0 0 960 500"
            className="w-full h-full select-none"
            style={{ filter: "drop-shadow(0 0 30px rgba(0,0,0,0.8))" }}
          >
            {/* Ocean Sphere Background */}
            <path
              d={mapData.spherePath}
              fill="#06080C"
              stroke="#1C212B"
              strokeWidth="1.5"
            />

            {/* Lat/Long Grid Graticules */}
            <path
              d={mapData.graticulePath}
              fill="none"
              stroke="#151A24"
              strokeWidth="0.75"
              strokeDasharray="2 3"
            />

            {/* Real World Country Polygons */}
            <g className="countries-layer">
              {mapData.countryPaths.map((c) => (
                <path
                  key={c.id}
                  d={c.d}
                  fill="#111620"
                  stroke="#202938"
                  strokeWidth="0.8"
                  className="transition-colors hover:fill-[#1A2232] cursor-pointer"
                />
              ))}
            </g>

            {/* Telemetry Interconnect Mesh Lines */}
            <g className="mesh-lines opacity-40">
              <path
                d="M 305 140 L 498 126 L 682 225 L 759 295 L 852 387"
                fill="none"
                stroke="#5B8CFF"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <path
                d="M 305 140 L 388 343 L 553 351 L 682 225"
                fill="none"
                stroke="#5B8CFF"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <path
                d="M 197 145 L 305 140"
                fill="none"
                stroke="#5B8CFF"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <path
                d="M 682 225 L 834 148"
                fill="none"
                stroke="#5B8CFF"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
            </g>

            {/* Telemetry Probe Pins & Radar Waves */}
            {nodes.map((n) => {
              const isSelected = selectedNode?.id === n.id;
              const isIncident = n.incidentsCount > 0;
              const nodeColor = isIncident ? "#FF4D6D" : "#3DDC84";

              return (
                <g
                  key={n.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(n)}
                >
                  {/* Ping Radar Wave */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isSelected ? 18 : 11}
                    fill={nodeColor}
                    opacity="0.2"
                    className="animate-ping"
                    style={{ animationDuration: isIncident ? "1s" : "2.5s" }}
                  />

                  {/* Core Node Circle */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isSelected ? 6 : 4}
                    fill={nodeColor}
                    stroke="#000000"
                    strokeWidth="1.5"
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* Clean City Name Callout */}
                  <g transform={`translate(${n.x + 8}, ${n.y + 3})`}>
                    <rect
                      x="-2"
                      y="-10"
                      width={n.name.split(" ")[0].length * 7 + 10}
                      height="14"
                      fill="#0D1117"
                      rx="3"
                      opacity="0.85"
                      stroke="#262626"
                      strokeWidth="0.5"
                    />
                    <text
                      x="3"
                      y="0"
                      fill={isSelected ? "#5B8CFF" : "#CBD5E1"}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {n.name.split(" ")[0]}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Probe City Telemetry Card */}
        {selectedNode && (
          <div className="mt-4 bg-card2 border border-line p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-card border border-line font-mono font-bold text-accent text-sm">
                {selectedNode.code}
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
                  Edge Probe ID: <span className="font-mono text-accent">{selectedNode.id}</span> · Coordinates: <span className="font-mono text-white/50">{selectedNode.coordinates[1].toFixed(2)}°N, {selectedNode.coordinates[0].toFixed(2)}°E</span>
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

      {/* Regional Nodes Directory */}
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
                    {n.code}
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
