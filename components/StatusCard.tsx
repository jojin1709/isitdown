"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink } from "lucide-react";

type Props = {
  name: string;
  domain: string;
  url: string;
  category: string;
  status: "up" | "down" | "slow";
  responseTime: number | null;
  httpStatus: number | null;
};

const STATUS_CONFIG = {
  up: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400 pulse-glow-green",
    label: "Operational",
    icon: CheckCircle2,
  },
  slow: {
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400 pulse-glow-amber",
    label: "High Latency",
    icon: AlertTriangle,
  },
  down: {
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    dot: "bg-rose-500 pulse-glow-red",
    label: "Outage Detected",
    icon: XCircle,
  },
};

export default function StatusCard({
  name,
  domain,
  url,
  category,
  status,
  responseTime,
  httpStatus,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const cfg = STATUS_CONFIG[status];
  const IconComponent = cfg.icon;

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between group relative overflow-hidden">
      {/* Top Section: Logo & Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Brand Logo Container */}
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-white/20 transition-all duration-300">
              {!imgError ? (
                <img
                  src={faviconUrl}
                  alt={`${name} logo`}
                  className="w-full h-full object-contain rounded-md"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <span className="text-sm font-bold text-white/80">
                  {name.charAt(0)}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5 truncate"
              >
                <span className="truncate">{name}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
              <span className="text-[11px] font-medium text-white/40 block truncate">
                {category}
              </span>
            </div>
          </div>

          {/* Live Status Pulse Indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} live-dot`} />
          </div>
        </div>
      </div>

      {/* Bottom Section: Latency & HTTP Status pill */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between mt-1">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}
        >
          <IconComponent className="w-3.5 h-3.5" />
          <span>{cfg.label}</span>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono font-medium text-white/70">
            {responseTime != null ? `${responseTime}ms` : "N/A"}
          </span>
          {httpStatus ? (
            <span className="text-[10px] text-white/35 font-mono block">
              HTTP {httpStatus}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
