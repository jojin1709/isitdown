"use client";

import { useState } from "react";
import { Tag, Copy, Check } from "lucide-react";

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
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-card border border-line shrink-0">
            <Tag className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Embed Live Status Badge</h3>
            <p className="text-xs text-white/50">
              Display live availability badge for {serviceName} on your GitHub README or website
            </p>
          </div>
        </div>
        <button
          onClick={copyCode}
          className="px-3.5 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent/80 transition-colors flex items-center gap-1.5 shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-card border border-line rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
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
