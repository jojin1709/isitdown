"use client";

import { useEffect, useMemo, useState } from "react";
import StatusCard from "@/components/StatusCard";
import CustomCheck from "@/components/CustomCheck";
import {
  Activity,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Github,
  SlidersHorizontal,
} from "lucide-react";

type ServiceStatus = {
  id: string;
  name: string;
  domain: string;
  url: string;
  category: string;
  status: "up" | "down" | "slow";
  responseTime: number | null;
  httpStatus: number | null;
};

const CATEGORIES = [
  "All",
  "Social",
  "Shopping",
  "Streaming",
  "Dev/AI",
  "India",
  "Finance",
];

const POLL_MS = 60000;

export default function Dashboard() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "status" | "latency">("default");

  async function load(isManual = false) {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      setServices(data.services || []);
      setLastChecked(data.checkedAt);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(() => load(false), POLL_MS);
    return () => clearInterval(interval);
  }, []);

  const filteredAndSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = services.filter(
      (s) =>
        (category === "All" || s.category === category) &&
        (!q || s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q))
    );

    if (sortBy === "status") {
      const priority = { down: 0, slow: 1, up: 2 };
      list = [...list].sort((a, b) => priority[a.status] - priority[b.status]);
    } else if (sortBy === "latency") {
      list = [...list].sort((a, b) => {
        if (a.responseTime === null) return 1;
        if (b.responseTime === null) return -1;
        return a.responseTime - b.responseTime;
      });
    }

    return list;
  }, [services, category, query, sortBy]);

  const downCount = services.filter((s) => s.status === "down").length;
  const slowCount = services.filter((s) => s.status === "slow").length;
  const upCount = services.filter((s) => s.status === "up").length;

  return (
    <div className="min-h-screen pb-16">
      {/* Top Header Navbar */}
      <header className="border-b border-white/[0.08] bg-black/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  IsIt<span className="text-blue-500">Down</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  LIVE
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => load(true)}
              disabled={refreshing || loading}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white/70 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2 text-xs font-semibold"
              title="Refresh status checks"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <a
              href="https://github.com/jojin1709/isitdown"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white/70 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-10">
        {/* Hero Section */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Automated Real-Time Uptime Monitor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            Is it <span className="text-rose-500">down</span>, or just you?
          </h1>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Instant live health status checks for popular global & regional web services.
            Checks run server-side every 60 seconds.
          </p>

          {/* Stats Bar */}
          <div className="flex justify-center items-center gap-2.5 mt-6 flex-wrap">
            <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>{loading ? "Loading..." : `${services.length} Tracked`}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{upCount} Operational</span>
            </div>

            {slowCount > 0 && (
              <div className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{slowCount} Slow</span>
              </div>
            )}

            {downCount > 0 ? (
              <div className="px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                <span>{downCount} Down</span>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-white/40">
                0 Outages
              </div>
            )}

            {lastChecked && (
              <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-white/40">
                Updated {new Date(lastChecked).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Custom URL Checker Widget */}
        <div className="mb-10 max-w-4xl mx-auto">
          <CustomCheck />
        </div>

        {/* Search & Category Filter Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  category === c
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/25"
                    : "bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search Input & Sort Dropdown */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by name..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-blue-500 focus:bg-white/[0.06] transition-all"
              />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 font-semibold outline-none focus:border-blue-500 cursor-pointer appearance-none pr-8"
              >
                <option value="default" className="bg-[#111622] text-white">Default</option>
                <option value="status" className="bg-[#111622] text-white">Status</option>
                <option value="latency" className="bg-[#111622] text-white">Fastest</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Status Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl glass-card border border-white/5 p-4 animate-pulse flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-white/10 rounded w-2/3" />
                    <div className="h-2.5 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-4 bg-white/5 rounded w-full mt-2" />
              </div>
            ))}
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-white/10 max-w-md mx-auto my-8">
            <Search className="w-8 h-8 text-white/30 mx-auto mb-3" />
            <p className="text-sm font-bold text-white mb-1">No matching services found</p>
            <p className="text-xs text-white/40">Try searching for a different service name or clear filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSorted.map((s) => (
              <StatusCard key={s.id} {...s} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-8 mt-16 pt-8 border-t border-white/[0.08] text-center text-xs text-white/40">
        <p>
          IsItDown performs real-time HTTP server connectivity checks against tracked endpoints.
        </p>
      </footer>
    </div>
  );
}
