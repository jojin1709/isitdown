"use client";

import { useState } from "react";
import DiagnosticsCard from "@/components/DiagnosticsCard";
import ShareOutage from "@/components/ShareOutage";
import { DiagnosticsResult } from "@/lib/diagnostics";

type Result = {
  name: string;
  url: string;
  status: "up" | "down" | "slow";
  responseTime: number | null;
  httpStatus: number | null;
  error?: string;
  diagnostics?: DiagnosticsResult;
};

export default function CustomCheck() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setImgError(false);
    try {
      const res = await fetch(`/api/check?url=${encodeURIComponent(input.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not check that URL");
      } else {
        setResult(data);
      }
    } catch {
      setError("Something went wrong checking that URL");
    } finally {
      setLoading(false);
    }
  }

  const getFaviconUrl = (urlStr: string) => {
    try {
      const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
      return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
    } catch {
      return `https://www.google.com/s2/favicons?domain=${urlStr}&sz=64`;
    }
  };

  return (
    <div className="bg-card2 border border-line rounded-2xl p-5">
      <p className="text-sm font-semibold mb-3">Check any other site</p>
      <form onSubmit={handleCheck} className="flex flex-wrap gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. mysite.com or https://example.com"
          className="flex-1 min-w-[200px] bg-card border border-line rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-accent disabled:opacity-50 text-white transition-opacity"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {error && <p className="text-down text-xs mt-3">{error}</p>}

      {result && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between bg-card border border-line rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                {!imgError ? (
                  <img
                    src={getFaviconUrl(result.url)}
                    alt={`${result.name} favicon`}
                    className="w-5 h-5 object-contain rounded"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-base">🌐</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">{result.name}</p>
                <p className="text-[11px] text-white/40 truncate max-w-[220px]">
                  {result.url}
                </p>
              </div>
            </div>

            <div className="text-right">
              {result.error === "domain not found" ? (
                <p className="text-xs text-down font-medium max-w-[280px]">
                  Couldn't find that domain — check the spelling (e.g. claude.ai, not just 'claude')
                </p>
              ) : (
                <>
                  <p
                    className={`text-sm font-semibold ${
                      result.status === "up"
                        ? "text-up"
                        : result.status === "slow"
                        ? "text-slow"
                        : "text-down"
                    }`}
                  >
                    {result.status === "up"
                      ? "It's up"
                      : result.status === "slow"
                      ? "Up, but slow"
                      : "Looks down"}
                  </p>
                  <p className="text-[11px] text-white/40">
                    {result.responseTime != null
                      ? `${result.responseTime}ms`
                      : result.error || "—"}
                  </p>
                </>
              )}
            </div>
          </div>

          {result.diagnostics && (
            <DiagnosticsCard
              diagnostics={result.diagnostics}
              serviceName={result.name}
            />
          )}

          <ShareOutage
            serviceName={result.name}
            url={result.url}
            status={result.status}
            responseTime={result.responseTime}
          />
        </div>
      )}
    </div>
  );
}
