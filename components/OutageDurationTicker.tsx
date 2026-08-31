"use client";

import { useEffect, useState } from "react";

type Props = {
  startTime?: string | number;
  status: "up" | "down" | "slow";
};

export default function OutageDurationTicker({ startTime, status }: Props) {
  const [elapsed, setElapsed] = useState<string>("0m 00s");

  useEffect(() => {
    if (status === "up") return;

    const initial = typeof startTime === "number" ? startTime : startTime ? new Date(startTime).getTime() : Date.now() - 14 * 60 * 1000;

    const interval = setInterval(() => {
      const diffMs = Math.max(0, Date.now() - initial);
      const mins = Math.floor(diffMs / 60000);
      const secs = Math.floor((diffMs % 60000) / 1000);
      setElapsed(`${mins}m ${secs < 10 ? `0${secs}` : secs}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, status]);

  if (status === "up") return null;

  const isDown = status === "down";

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
        isDown
          ? "bg-down/15 border-down/40 text-down"
          : "bg-slow/15 border-slow/40 text-slow"
      }`}
    >
      <span className="w-2 h-2 rounded-full bg-current live-dot" />
      <span>
        {isDown ? "Down for" : "Degraded for"} {elapsed}
      </span>
    </div>
  );
}
