"use client";

import { useEffect, useMemo, useState } from "react";
import StatusCard from "@/components/StatusCard";
import CustomCheck from "@/components/CustomCheck";

type ServiceStatus = {
  id: string;
  name: string;
  icon: string;
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter(
      (s) =>
        (category === "All" || s.category === category) &&
        (!q || s.name.toLowerCase().includes(q))
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
          Live status for the apps and sites people actually check. No login, refreshes automatically.
        </p>

        <div className="flex justify-center gap-3 mt-5 flex-wrap text-xs">
          <span className="px-3 py-1.5 rounded-full bg-card border border-line text-white/60">
            {loading ? "Checking..." : `${services.length} tracked`}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-down/10 border border-down/30 text-down font-semibold">
            {downCount} down
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slow/10 border border-slow/30 text-slow font-semibold">
            {slowCount} slow
          </span>
          {lastChecked && (
            <span className="px-3 py-1.5 rounded-full bg-card border border-line text-white/40">
              updated {new Date(lastChecked).toLocaleTimeString()}
            </span>
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

      {loading ? (
        <p className="text-center text-white/40 text-sm py-16">
          Checking all services for the first time — this takes a few seconds...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-white/40 text-sm py-16">
          No services match that search.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((s) => (
            <StatusCard key={s.id} {...s} />
          ))}
        </div>
      )}

      <footer className="text-center text-xs text-white/25 mt-14 pt-6 border-t border-line">
        Status checks run live against each site — a "down" here means the
        server didn't respond properly, not a guess.
      </footer>
    </div>
  );
}
