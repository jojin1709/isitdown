"use client";

import { DiagnosticsResult } from "@/lib/diagnostics";

type Props = {
  diagnostics?: DiagnosticsResult;
  serviceName?: string;
};

export default function DiagnosticsCard({ diagnostics, serviceName }: Props) {
  if (!diagnostics) return null;

  const { ssl, timings, ip, hostname } = diagnostics;
  const totalLatency = timings.totalMs || 1;

  const dnsPercent = Math.max(8, Math.round((timings.dnsLookupMs / totalLatency) * 100));
  const tcpPercent = Math.max(8, Math.round((timings.tcpConnectMs / totalLatency) * 100));
  const tlsPercent = Math.max(8, Math.round((timings.tlsHandshakeMs / totalLatency) * 100));
  const ttfbPercent = Math.max(8, Math.round((timings.ttfbMs / totalLatency) * 100));

  const isSslValid = ssl?.valid ?? false;

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold text-lg">🔒</span>
          <div>
            <h3 className="text-sm font-bold text-white">
              SSL Certificate & Network Diagnostics
            </h3>
            <p className="text-xs text-white/50">
              Protocol verification and connection breakdown for {serviceName || hostname}
            </p>
          </div>
        </div>

        {ip && (
          <span className="px-2.5 py-1 rounded-lg bg-card border border-line text-[11px] font-mono text-white/60 self-start sm:self-auto">
            IP: {ip}
          </span>
        )}
      </div>

      {/* SSL Certificate Details Grid */}
      {ssl && (
        <div className="bg-card border border-line rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isSslValid ? "bg-up live-dot" : "bg-down"
                }`}
              />
              <span className="text-xs font-bold text-white">
                SSL / TLS Certificate Status
              </span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                isSslValid
                  ? "bg-up/10 border-up/30 text-up"
                  : "bg-down/10 border-down/30 text-down"
              }`}
            >
              {isSslValid ? "Valid & Secure" : "Invalid / Expired"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-white/40 text-[11px] mb-0.5">Issuer</p>
              <p className="font-semibold text-white truncate" title={ssl.issuer}>
                {ssl.issuer || "Trusted Authority"}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-[11px] mb-0.5">Protocol</p>
              <p className="font-semibold font-mono text-white">
                {ssl.protocol || "TLS 1.3"}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-[11px] mb-0.5">Expires In</p>
              <p
                className={`font-semibold font-mono ${
                  ssl.daysRemaining < 15
                    ? "text-down font-bold"
                    : ssl.daysRemaining < 30
                    ? "text-slow"
                    : "text-up"
                }`}
              >
                {ssl.daysRemaining} days
              </p>
            </div>
            <div>
              <p className="text-white/40 text-[11px] mb-0.5">Expiry Date</p>
              <p className="font-mono text-white/70 text-[11px] truncate">
                {ssl.validTo ? new Date(ssl.validTo).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Network Latency Waterfall */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-white/80">Network Latency Breakdown</span>
          <span className="text-white/40 font-mono">Total: {timings.totalMs} ms</span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="h-3 w-full rounded-full bg-card border border-line flex overflow-hidden p-0.5 gap-0.5 mb-3">
          <div
            style={{ width: `${dnsPercent}%` }}
            className="bg-purple-500 rounded-l-full h-full transition-all"
            title={`DNS: ${timings.dnsLookupMs}ms`}
          />
          <div
            style={{ width: `${tcpPercent}%` }}
            className="bg-blue-500 h-full transition-all"
            title={`TCP Connect: ${timings.tcpConnectMs}ms`}
          />
          <div
            style={{ width: `${tlsPercent}%` }}
            className="bg-emerald-500 h-full transition-all"
            title={`TLS Handshake: ${timings.tlsHandshakeMs}ms`}
          />
          <div
            style={{ width: `${ttfbPercent}%` }}
            className="bg-amber-500 rounded-r-full h-full transition-all"
            title={`TTFB: ${timings.ttfbMs}ms`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
            <span className="text-white/60">DNS Lookup:</span>
            <span className="font-mono font-semibold text-white ml-auto">
              {timings.dnsLookupMs}ms
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
            <span className="text-white/60">TCP Connect:</span>
            <span className="font-mono font-semibold text-white ml-auto">
              {timings.tcpConnectMs}ms
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-white/60">TLS Handshake:</span>
            <span className="font-mono font-semibold text-white ml-auto">
              {timings.tlsHandshakeMs}ms
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-white/60">TTFB (Response):</span>
            <span className="font-mono font-semibold text-white ml-auto">
              {timings.ttfbMs}ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
