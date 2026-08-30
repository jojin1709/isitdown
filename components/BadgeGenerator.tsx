"use client";

import { useState } from "react";

type Props = {
  serviceId: string;
  serviceName: string;
};

export default function BadgeGenerator({ serviceId, serviceName }: Props) {
  const [copied, setCopied] = useState(false);
  const badgeUrl = `https://isitdown-live.vercel.app/api/badge?serviceId=${serviceId}`;
  const markdownCode = `[![${serviceName} Status](${badgeUrl})](https://isitdown-live.vercel.app/status/${serviceId})`;

  function copyCode() {
    navigator.clipboard.writeText(markdownCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-accent font-bold text-lg">🏷️</span>
          <h3 className="text-sm font-bold text-white">Embed Live Status Badge</h3>
        </div>
        <button
          onClick={copyCode}
          className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent/80 transition-colors flex items-center gap-1"
        >
          {copied ? "✓ Copied!" : "Copy Markdown Code"}
        </button>
      </div>
      <p className="text-xs text-white/50 mb-4">
        Display live availability badge for {serviceName} on your GitHub README or website:
      </p>

      <div className="bg-card border border-line rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="shrink-0">
          <img
            src={`/api/badge?serviceId=${serviceId}`}
            alt={`${serviceName} live status badge`}
            className="h-7 object-contain"
          />
        </div>
        <code className="bg-card2 border border-line rounded-lg px-3 py-2 text-[11px] font-mono text-white/70 overflow-x-auto w-full select-all">
          {markdownCode}
        </code>
      </div>
    </div>
  );
}
