"use client";

import { SecurityAuditResult } from "@/lib/headerAudit";

type Props = {
  audit?: SecurityAuditResult;
  serviceName?: string;
};

export default function SecurityAuditCard({ audit, serviceName }: Props) {
  if (!audit) return null;

  const gradeColor =
    audit.grade === "A+" || audit.grade === "A"
      ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
      : audit.grade === "B"
      ? "text-blue-400 border-blue-500/40 bg-blue-500/10"
      : audit.grade === "C"
      ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
      : "text-rose-400 border-rose-500/40 bg-rose-500/10";

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xl">🛡️</span>
          <div>
            <h3 className="text-sm font-bold text-white">
              Security & HTTP Headers Health Audit
            </h3>
            <p className="text-xs text-white/50">
              Protocol verification, compression, and vulnerability defenses for {serviceName || "target server"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
              Security Score
            </p>
            <p className="font-mono font-bold text-sm text-white">{audit.score} / 100</p>
          </div>

          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-extrabold text-xl ${gradeColor}`}
          >
            {audit.grade}
          </div>
        </div>
      </div>

      {/* Meta Specs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-card border border-line p-3.5 rounded-xl mb-5 text-xs">
        <div>
          <p className="text-[10px] text-white/40 uppercase mb-0.5">Protocol</p>
          <p className="font-semibold text-white font-mono">{audit.httpVersion || "HTTP/2"}</p>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase mb-0.5">Compression</p>
          <p className="font-semibold text-white font-mono">{audit.compression || "None"}</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-[10px] text-white/40 uppercase mb-0.5">Server Banner</p>
          <p className="font-semibold text-white truncate" title={audit.serverBanner}>
            {audit.serverBanner || "Protected / Hidden"}
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2.5">
        <p className="text-xs font-bold text-white/80">Security Policy Breakdown</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {audit.checks.map((c) => (
            <div
              key={c.header}
              className="bg-card border border-line rounded-xl p-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-white truncate">
                  {c.header}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    c.status === "pass"
                      ? "bg-up/10 text-up border border-up/30"
                      : c.status === "warn"
                      ? "bg-slow/10 text-slow border border-slow/30"
                      : "bg-down/10 text-down border border-down/30"
                  }`}
                >
                  {c.status === "pass" ? "Passed" : c.status === "warn" ? "Warn" : "Missing"}
                </span>
              </div>
              <p className="text-[11px] text-white/60 leading-normal">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
