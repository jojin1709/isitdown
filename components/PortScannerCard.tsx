"use client";

import { Network } from "lucide-react";
import { PortStatus } from "@/lib/portScanner";

type Props = {
  ports?: PortStatus[];
  host?: string;
};

export default function PortScannerCard({ ports, host }: Props) {
  if (!ports || ports.length === 0) return null;

  const openCount = ports.filter((p) => p.status === "open").length;

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-card border border-line shrink-0">
            <Network className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              TCP Port & Network Service Scanner
            </h3>
            <p className="text-xs text-white/50">
              Live socket reachability for SSH, Databases, Mail, and Web servers on {host || "target host"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-full bg-up/10 border border-up/30 text-up text-xs font-semibold">
            {openCount} Open Ports
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ports.map((p) => {
          const isOpen = p.status === "open";
          const isClosed = p.status === "closed";

          const statusBadgeClass = isOpen
            ? "bg-up/15 text-up border-up/40"
            : isClosed
            ? "bg-line/40 text-white/40 border-line"
            : "bg-down/15 text-down border-down/40";

          const statusText = isOpen ? "OPEN" : isClosed ? "CLOSED" : "FILTERED";

          return (
            <div
              key={p.port}
              className="bg-card border border-line rounded-xl p-3.5 flex items-center justify-between gap-2 hover:border-white/20 transition-all text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono font-bold text-sm text-white">
                    Port {p.port}
                  </span>
                  <span className="text-[10px] text-white/40 uppercase font-semibold">
                    {p.category}
                  </span>
                </div>
                <p className="text-[11px] text-white/60">{p.service}</p>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${statusBadgeClass}`}
                >
                  {statusText}
                </span>
                <p className="text-[10px] text-white/40 font-mono mt-1">
                  {p.latencyMs} ms
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
