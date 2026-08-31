"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { DnsRecordItem } from "@/lib/dnsInspector";

type Props = {
  records?: DnsRecordItem[];
  domain?: string;
};

export default function DnsRecordsCard({ records, domain }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!records || records.length === 0) return null;

  function copyRecord(val: string, idx: number) {
    navigator.clipboard.writeText(val);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  const typeColors: Record<string, string> = {
    A: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    AAAA: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    MX: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    NS: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    TXT: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    SOA: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  };

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-card border border-line shrink-0">
            <Search className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Public DNS Records Inspector
            </h3>
            <p className="text-xs text-white/50">
              Live DNS zones, mail exchange (MX), and nameservers for {domain || "target domain"}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-card border border-line text-white/60 text-xs font-mono self-start sm:self-auto">
          {records.length} Records Found
        </span>
      </div>

      <div className="space-y-2">
        {records.map((r, idx) => {
          const colorClass = typeColors[r.type] || "bg-card border-line text-white";

          return (
            <div
              key={idx}
              className="bg-card border border-line rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-white/20 transition-all text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border shrink-0 ${colorClass}`}
                >
                  {r.type}
                </span>

                <div className="min-w-0">
                  <p className="font-mono text-white font-medium truncate select-all" title={r.value}>
                    {r.value}
                  </p>
                  {r.priority !== undefined && (
                    <p className="text-[10px] text-white/40 font-mono">
                      Priority: {r.priority}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => copyRecord(r.value, idx)}
                className="text-[11px] font-semibold text-white/40 hover:text-white transition-colors shrink-0 px-2 py-1 rounded-lg hover:bg-card2 border border-transparent hover:border-line self-end sm:self-auto"
              >
                {copiedIdx === idx ? "✓ Copied" : "Copy"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
