"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  id: string;
  name: string;
  domain?: string;
  icon?: string;
  category: string;
  status: "up" | "down" | "slow";
  responseTime: number | null;
  httpStatus: number | null;
};

const STATUS_STYLES = {
  up: { dot: "bg-up", text: "text-up", label: "Up" },
  slow: { dot: "bg-slow", text: "text-slow", label: "Slow" },
  down: { dot: "bg-down", text: "text-down", label: "Down" },
};

export default function StatusCard({
  id,
  name,
  domain,
  icon = "🌐",
  category,
  status,
  responseTime,
  httpStatus,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const s = STATUS_STYLES[status];

  const hostname = domain || `${id}.com`;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

  return (
    <Link
      href={`/status/${id}`}
      className="bg-card border border-line rounded-2xl p-4 flex flex-col gap-3 hover:border-white/20 transition-all block"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 flex items-center justify-center shrink-0">
            {!imgError ? (
              <img
                src={faviconUrl}
                alt={`${name} icon`}
                className="w-5 h-5 object-contain rounded"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-xl">{icon}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{name}</p>
            <p className="text-[11px] text-white/35">{category}</p>
          </div>
        </div>
        <span className={`w-2.5 h-2.5 rounded-full ${s.dot} live-dot`} />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${s.text}`}>{s.label}</span>
        <span className="text-white/40">
          {responseTime != null ? `${responseTime}ms` : "—"}
          {httpStatus ? ` · ${httpStatus}` : ""}
        </span>
      </div>
    </Link>
  );
}
