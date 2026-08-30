"use client";

import { RegionLatency } from "@/lib/history";

type Props = {
  regions: RegionLatency[];
};

export default function MultiRegionStatus({ regions }: Props) {
  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-accent font-bold text-lg">🌐</span>
        <h3 className="text-sm font-bold text-white">Global Edge Probes</h3>
      </div>
      <p className="text-xs text-white/50 mb-4">
        Multi-region health checks executed across edge network locations:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {regions.map((r) => (
          <div
            key={r.region}
            className="bg-card border border-line rounded-xl p-3.5 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{r.flag}</span>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">{r.location}</p>
                <p className="text-[10px] text-white/40">{r.region}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-up block">
                {r.latency} ms
              </span>
              <span className="text-[10px] text-up font-medium">Operational</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
