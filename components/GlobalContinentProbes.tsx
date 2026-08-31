"use client";

import { ContinentProbe } from "@/lib/diagnostics";

type Props = {
  probes?: ContinentProbe[];
  serviceName?: string;
};

export default function GlobalContinentProbes({ probes, serviceName }: Props) {
  if (!probes || probes.length === 0) return null;

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold text-lg">🌐</span>
          <div>
            <h3 className="text-sm font-bold text-white">
              Multi-Continent Global Ping Probes
            </h3>
            <p className="text-xs text-white/50">
              Live Edge latency measurements for {serviceName || "target domain"} across 5 continents
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-up/10 border border-up/30 text-up text-[11px] font-semibold self-start sm:self-auto">
          ● Global Edge Verified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {probes.map((p) => {
          const latencyClass =
            p.latencyMs < 75
              ? "text-up"
              : p.latencyMs < 200
              ? "text-slow"
              : "text-down";

          return (
            <div
              key={p.continent}
              className="bg-card border border-line rounded-xl p-3 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{p.flag}</span>
                <span className="w-2 h-2 rounded-full bg-up live-dot" />
              </div>

              <div>
                <p className="text-[11px] text-white/40 uppercase tracking-wider font-semibold">
                  {p.continent}
                </p>
                <p className="text-xs font-semibold text-white truncate" title={p.location}>
                  {p.location}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-line flex items-baseline justify-between">
                <span className="text-[10px] text-white/40">Latency</span>
                <span className={`font-mono font-bold text-xs ${latencyClass}`}>
                  {p.latencyMs} ms
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
