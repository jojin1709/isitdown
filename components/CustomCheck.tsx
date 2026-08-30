"use client";

import { useState } from "react";

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
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-accent disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {error && <p className="text-down text-xs mt-3">{error}</p>}

      {result && (
        <div className="mt-4 flex items-center justify-between bg-card border border-line rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-semibold">{result.name}</p>
            <p className="text-[11px] text-white/40 truncate max-w-[220px]">
              {result.url}
            </p>
          </div>
          <div className="text-right">
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
              {result.responseTime != null ? `${result.responseTime}ms` : result.error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
