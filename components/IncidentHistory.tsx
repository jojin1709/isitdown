"use client";

import { Incident } from "@/lib/incidents";

type Props = {
  incidents: Incident[];
  serviceName: string;
};

export default function IncidentHistory({ incidents, serviceName }: Props) {
  if (!incidents || incidents.length === 0) return null;

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-accent font-bold text-lg">📜</span>
        <h3 className="text-sm font-bold text-white">Recent Incident History</h3>
      </div>
      <p className="text-xs text-white/50 mb-4">
        Log of verified downtime events and network status updates for {serviceName}:
      </p>

      <div className="space-y-3">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="bg-card border border-line rounded-xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    inc.severity === "Major"
                      ? "bg-down/10 border-down/30 text-down"
                      : "bg-slow/10 border-slow/30 text-slow"
                  }`}
                >
                  {inc.severity} Outage
                </span>
                <span className="text-xs text-white/40 font-mono">{inc.date}</span>
              </div>
              <span className="text-[11px] font-semibold text-up flex items-center gap-1">
                ✓ {inc.status} ({inc.duration})
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">{inc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
