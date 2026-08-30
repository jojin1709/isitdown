"use client";

import { useEffect, useMemo, useState } from "react";
import StatusCard from "@/components/StatusCard";
import CustomCheck from "@/components/CustomCheck";

type ServiceStatus = {
  id: string;
  name: string;
  domain?: string;
  icon?: string;
  url: string;
  category: string;
  status: "up" | "down" | "slow";
  responseTime: number | null;
  httpStatus: number | null;
};

const CATEGORIES = ["All", "Social", "Shopping", "Streaming", "Dev/AI", "India", "Finance"];
const POLL_MS = 60000;

export default function Dashboard() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      setServices(data.services || []);
      setLastChecked(data.checkedAt);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
  }, []);

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = services.filter(
      (s) =>
        (category === "All" || s.category === category) &&
        (!q || s.name.toLowerCase().includes(q))
    );

    const STATUS_ORDER = { down: 0, slow: 1, up: 2 };
    return [...filtered].sort(
      (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    );
  }, [services, category, query]);

  const downCount = services.filter((s) => s.status === "down").length;
  const slowCount = services.filter((s) => s.status === "slow").length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Is it <span className="text-down">down</span>, or just you?
        </h1>
        <p className="text-white/50 text-sm">
          Live status for the apps and sites people actually check. Developed by{" "}
          <a
            href="https://github.com/jojin1709"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline font-semibold"
          >
            Jojin John
          </a>
          .
        </p>

        <div className="flex justify-center items-center gap-3 mt-5 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-full bg-card border border-line text-white/60">
            {services.length} tracked
          </span>
          <span className="px-3 py-1.5 rounded-full bg-down/10 border border-down/30 text-down font-semibold">
            {downCount} down
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slow/10 border border-slow/30 text-slow font-semibold">
            {slowCount} slow
          </span>
          {lastChecked && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-line text-white/40">
              <span>updated {new Date(lastChecked).toLocaleTimeString()}</span>
              <button
                onClick={load}
                disabled={loading}
                className="hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center ml-1"
                title="Refresh status checks"
              >
                <svg
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <CustomCheck />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a service..."
          className="flex-1 min-w-[180px] bg-card2 border border-line rounded-full px-4 py-2 text-sm outline-none focus:border-accent"
        />
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border ${
                category === c
                  ? "bg-accent border-accent text-white"
                  : "border-line text-white/50 hover:border-white/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && services.length === 0 ? (
        <p className="text-center text-white/40 text-sm py-16">
          Checking all services for the first time — this takes a few seconds...
        </p>
      ) : filteredAndSorted.length === 0 ? (
        <p className="text-center text-white/40 text-sm py-16">
          No services match that search.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAndSorted.map((s) => (
            <StatusCard key={s.id} {...s} />
          ))}
        </div>
      )}

      <footer className="text-center text-xs text-white/30 mt-14 pt-6 border-t border-line">
        <p className="mb-1">
          Status checks run live against each site — a "down" here means the server didn't respond properly, not a guess.
        </p>
        <p className="text-white/50">
          Developed by{" "}
          <a
            href="https://github.com/jojin1709"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline font-semibold"
          >
            Jojin John
          </a>
        </p>
      </footer>
    </div>
  );
}
