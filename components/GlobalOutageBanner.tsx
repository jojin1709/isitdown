"use client";

import Link from "next/link";
import { AlertTriangle, AlertCircle } from "lucide-react";
import OutageDurationTicker from "@/components/OutageDurationTicker";

type DownService = {
  id: string;
  name: string;
  category: string;
  status: "down" | "slow" | "up";
};

type Props = {
  services: DownService[];
};

export default function GlobalOutageBanner({ services }: Props) {
  const downList = services.filter((s) => s.status === "down");
  const slowList = services.filter((s) => s.status === "slow");

  if (downList.length === 0 && slowList.length === 0) {
    return null;
  }

  const isCritical = downList.length > 0;

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 mb-8 border backdrop-blur-md transition-all ${
        isCritical
          ? "bg-down/10 border-down/40 text-down"
          : "bg-slow/10 border-slow/40 text-slow"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-card border border-line/60 shrink-0">
            {isCritical ? (
              <AlertCircle className="w-6 h-6 text-down animate-pulse" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-slow" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-extrabold text-sm sm:text-base tracking-wide text-white">
                {isCritical
                  ? `Live Outage Alert: ${downList.length} Service${
                      downList.length > 1 ? "s" : ""
                    } Down`
                  : `Service Degradation: ${slowList.length} Service${
                      slowList.length > 1 ? "s" : ""
                    } Slow`}
              </span>
              <OutageDurationTicker status={isCritical ? "down" : "slow"} />
            </div>
            <p className="text-xs text-white/70">
              Active connectivity disruptions detected via live server probes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {downList.slice(0, 4).map((s) => (
            <Link
              key={s.id}
              href={`/status/${s.id}`}
              className="px-2.5 py-1 rounded-lg bg-card/80 border border-down/30 text-white hover:border-down text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-down live-dot" />
              <span>{s.name}</span>
            </Link>
          ))}
          {downList.length > 4 && (
            <span className="text-xs text-white/50 font-semibold">
              +{downList.length - 4} more
            </span>
          )}
          {downList.length === 0 &&
            slowList.slice(0, 3).map((s) => (
              <Link
                key={s.id}
                href={`/status/${s.id}`}
                className="px-2.5 py-1 rounded-lg bg-card/80 border border-slow/30 text-white hover:border-slow text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-slow" />
                <span>{s.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
