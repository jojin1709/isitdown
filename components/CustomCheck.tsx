"use client";

import { useState } from "react";
import { Search, Loader2, Globe, CheckCircle2, AlertTriangle, XCircle, ExternalLink, X } from "lucide-react";

type Result = {
  name: string;
  url: string;
  status: "up" | "down" | "slow";
  responseTime: number | null;
  httpStatus: number | null;
  error?: string;
};

export default function CustomCheck() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
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

  // Extract hostname for favicon
  const getDomain = (urlStr: string) => {
    try {
      const parsed = new URL(urlStr.startsWith("http") ? urlStr : `https://${urlStr}`);
      return parsed.hostname;
    } catch {
      return urlStr;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-2xl relative">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-blue-400" />
        <h2 className="text-sm font-bold text-white tracking-wide uppercase">
          Check Any Website Status Live
        </h2>
      </div>

      <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter website (e.g. github.com or https://example.com)"
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-blue-500 focus:bg-white/[0.06] transition-all"
          />
          {input && (
            <button
              type="button"
              onClick={() => {
                setInput("");
                setResult(null);
                setError("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg shadow-blue-600/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Check Status</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs font-medium">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/10 p-2 flex items-center justify-center shrink-0">
              <img
                src={`https://www.google.com/s2/favicons?domain=${getDomain(result.url)}&sz=128`}
                alt="Website favicon"
                className="w-full h-full object-contain rounded-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white truncate">{result.name}</p>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs font-mono text-white/40 truncate">{result.url}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                result.status === "up"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : result.status === "slow"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}
            >
              {result.status === "up" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : result.status === "slow" ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>
                {result.status === "up"
                  ? "Operational"
                  : result.status === "slow"
                  ? "Slow Response"
                  : "Service Down"}
              </span>
            </div>
            <p className="text-[11px] font-mono text-white/40 mt-1">
              {result.responseTime != null ? `${result.responseTime}ms` : result.error || "No response"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
