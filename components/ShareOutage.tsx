"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

type Props = {
  serviceName: string;
  serviceId?: string;
  url?: string;
  status: "up" | "down" | "slow";
  responseTime?: number | null;
};

export default function ShareOutage({
  serviceName,
  serviceId,
  url,
  status,
  responseTime,
}: Props) {
  const [copied, setCopied] = useState(false);

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : serviceId
      ? `https://isitdown-live.vercel.app/status/${serviceId}`
      : `https://isitdown-live.vercel.app`;

  const statusText =
    status === "down"
      ? "DOWN and unreachable"
      : status === "slow"
      ? "experiencing slow response latency"
      : "UP and fully operational";

  const latencySnippet = responseTime ? ` (${responseTime}ms)` : "";
  const shareMessage = `Is ${serviceName} down for everyone or just me? Currently ${statusText}${latencySnippet}. Check live status here: ${currentUrl}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareMessage
  )}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    shareMessage
  )}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    currentUrl
  )}`;
  const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(
    currentUrl
  )}&title=${encodeURIComponent(`Is ${serviceName} down? Current Status on IsItDown`)}`;

  function handleCopy() {
    navigator.clipboard.writeText(`${shareMessage}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="bg-card2 border border-line rounded-2xl p-5 mt-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-card border border-line shrink-0">
            <Share2 className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Share Live Status</h3>
            <p className="text-xs text-white/50">
              Let others know if {serviceName} is working or having an outage
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="px-3.5 py-2 rounded-xl bg-card border border-line hover:border-accent text-white text-xs font-semibold transition-all flex items-center gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-up" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-accent" />
              <span>Copy Info</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-card border border-line hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10 text-white text-xs font-semibold transition-all"
        >
          <span className="font-bold">𝕏</span>
          <span>Post on X</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-card border border-line hover:border-[#25D366]/50 hover:bg-[#25D366]/10 text-white text-xs font-semibold transition-all"
        >
          <span>WhatsApp</span>
        </a>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-card border border-line hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 text-white text-xs font-semibold transition-all"
        >
          <span>LinkedIn</span>
        </a>

        <a
          href={redditUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-card border border-line hover:border-[#FF4500]/50 hover:bg-[#FF4500]/10 text-white text-xs font-semibold transition-all"
        >
          <span>Reddit</span>
        </a>
      </div>
    </div>
  );
}
