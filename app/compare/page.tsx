"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Scale, Zap, ArrowRight } from "lucide-react";
import { SERVICES, ServiceDef } from "@/lib/services";

type ServiceCheck = {
  id: string;
  name: string;
  url: string;
  category: string;
  icon: string;
  domain: string;
  useFallbackIcon?: boolean;
  status: "up" | "down" | "slow";
  responseTime: number | null;
  httpStatus: number | null;
};

const PRESET_BATTLES = [
  { label: "ChatGPT vs Claude", s1: "chatgpt", s2: "claude" },
  { label: "Amazon vs Flipkart", s1: "amazonin", s2: "flipkart" },
  { label: "Jio vs Airtel", s1: "jio", s2: "airtel" },
  { label: "HDFC vs SBI", s1: "hdfc", s2: "sbi" },
  { label: "Netflix vs Prime Video", s1: "netflix", s2: "primevideo" },
  { label: "WhatsApp vs Telegram", s1: "whatsapp", s2: "telegram" },
];

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialS1 = searchParams.get("service1") || "chatgpt";
  const initialS2 = searchParams.get("service2") || "claude";

  const [s1Id, setS1Id] = useState(initialS1);
  const [s2Id, setS2Id] = useState(initialS2);
  const [allStatuses, setAllStatuses] = useState<Record<string, ServiceCheck>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      setLoading(true);
      try {
        const res = await fetch("/api/status");
        const data = await res.json();
        const map: Record<string, ServiceCheck> = {};
        if (data.services) {
          data.services.forEach((s: ServiceCheck) => {
            map[s.id] = s;
          });
        }
        setAllStatuses(map);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  function handleSelectS1(id: string) {
    setS1Id(id);
    router.replace(`/compare?service1=${id}&service2=${s2Id}`);
  }

  function handleSelectS2(id: string) {
    setS2Id(id);
    router.replace(`/compare?service1=${s1Id}&service2=${id}`);
  }

  function applyPreset(s1: string, s2: string) {
    setS1Id(s1);
    setS2Id(s2);
    router.replace(`/compare?service1=${s1}&service2=${s2}`);
  }

  const s1 = allStatuses[s1Id] || SERVICES.find((s) => s.id === s1Id);
  const s2 = allStatuses[s2Id] || SERVICES.find((s) => s.id === s2Id);

  const getFavicon = (service?: ServiceDef | ServiceCheck) => {
    if (!service) return null;
    if (service.useFallbackIcon) return null;
    const domain = service.domain || `${service.id}.com`;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  };

  const speedDifference = useMemo(() => {
    const r1 = (s1 as ServiceCheck)?.responseTime;
    const r2 = (s2 as ServiceCheck)?.responseTime;
    if (r1 == null || r2 == null) return null;
    const diff = Math.abs(r1 - r2);
    const faster = r1 < r2 ? s1?.name : s2?.name;
    return { diff, faster };
  }, [s1, s2]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex items-center justify-start mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
        >
          ← Back to all services
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-line text-xs font-semibold text-accent mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Head-to-Head Reliability Benchmark</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Service Uptime & Latency <span className="text-accent">Comparison</span>
        </h1>
        <p className="text-white/50 text-sm max-w-xl mx-auto">
          Compare real-time HTTP response speeds, availability status, and reliability between any two platforms.
        </p>
      </div>

      {/* Preset Battles */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 justify-start sm:justify-center">
        {PRESET_BATTLES.map((b) => (
          <button
            key={b.label}
            onClick={() => applyPreset(b.s1, b.s2)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
              s1Id === b.s1 && s2Id === b.s2
                ? "bg-accent border-accent text-white"
                : "bg-card border-line text-white/60 hover:border-white/30"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-card2 border border-line rounded-2xl p-5">
          <label className="block text-xs font-bold text-white/70 mb-2">
            SELECT SERVICE 1
          </label>
          <select
            value={s1Id}
            onChange={(e) => handleSelectS1(e.target.value)}
            className="w-full bg-card border border-line text-white rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-accent"
          >
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0D0D0D] text-white">
                {s.name} ({s.category})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-card2 border border-line rounded-2xl p-5">
          <label className="block text-xs font-bold text-white/70 mb-2">
            SELECT SERVICE 2
          </label>
          <select
            value={s2Id}
            onChange={(e) => handleSelectS2(e.target.value)}
            className="w-full bg-card border border-line text-white rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-accent"
          >
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#131722] text-white">
                {s.name} ({s.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Speed Advantage Summary Pill */}
      {speedDifference && speedDifference.diff > 0 && (
        <div className="bg-gradient-to-r from-accent/20 via-card to-accent/20 border border-accent/40 rounded-2xl p-4 mb-8 text-center">
          <p className="text-sm font-bold text-white">
            ⚡ <span className="text-accent">{speedDifference.faster}</span> is currently{" "}
            <span className="text-up">{speedDifference.diff} ms faster</span> in live response time
          </p>
        </div>
      )}

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service 1 Card */}
        {s1 && (
          <div className="bg-card border border-line rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-card2 border border-line p-2 flex items-center justify-center shrink-0">
                    {getFavicon(s1) ? (
                      <img
                        src={getFavicon(s1)!}
                        alt={s1.name}
                        className="w-7 h-7 object-contain rounded"
                      />
                    ) : (
                      <span className="text-2xl">{s1.icon}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">{s1.name}</h2>
                    <p className="text-xs text-white/40">{s1.category} · {s1.domain}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    (s1 as ServiceCheck)?.status === "up"
                      ? "bg-up/10 border-up/30 text-up"
                      : (s1 as ServiceCheck)?.status === "slow"
                      ? "bg-slow/10 border-slow/30 text-slow"
                      : "bg-down/10 border-down/30 text-down"
                  }`}
                >
                  {(s1 as ServiceCheck)?.status?.toUpperCase() || (loading ? "CHECKING" : "UP")}
                </span>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div className="bg-card2 border border-line p-3 rounded-xl flex items-center justify-between">
                  <span className="text-white/50">Live Response Latency</span>
                  <span className="font-mono font-bold text-sm text-white">
                    {(s1 as ServiceCheck)?.responseTime != null
                      ? `${(s1 as ServiceCheck).responseTime} ms`
                      : "—"}
                  </span>
                </div>

                <div className="bg-card2 border border-line p-3 rounded-xl flex items-center justify-between">
                  <span className="text-white/50">HTTP Status Code</span>
                  <span className="font-mono font-semibold text-white">
                    {(s1 as ServiceCheck)?.httpStatus
                      ? `HTTP ${(s1 as ServiceCheck).httpStatus}`
                      : "—"}
                  </span>
                </div>

                <div className="bg-card2 border border-line p-3 rounded-xl flex items-center justify-between">
                  <span className="text-white/50">Target URL</span>
                  <a
                    href={s1.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-accent hover:underline truncate max-w-[200px]"
                  >
                    {s1.url}
                  </a>
                </div>
              </div>
            </div>

            <Link
              href={`/status/${s1.id}`}
              className="w-full py-2.5 rounded-xl bg-accent text-white text-xs font-bold text-center hover:bg-accent/80 transition-all block"
            >
              View Full {s1.name} Status Page →
            </Link>
          </div>
        )}

        {/* Service 2 Card */}
        {s2 && (
          <div className="bg-card border border-line rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-card2 border border-line p-2 flex items-center justify-center shrink-0">
                    {getFavicon(s2) ? (
                      <img
                        src={getFavicon(s2)!}
                        alt={s2.name}
                        className="w-7 h-7 object-contain rounded"
                      />
                    ) : (
                      <span className="text-2xl">{s2.icon}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">{s2.name}</h2>
                    <p className="text-xs text-white/40">{s2.category} · {s2.domain}</p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    (s2 as ServiceCheck)?.status === "up"
                      ? "bg-up/10 border-up/30 text-up"
                      : (s2 as ServiceCheck)?.status === "slow"
                      ? "bg-slow/10 border-slow/30 text-slow"
                      : "bg-down/10 border-down/30 text-down"
                  }`}
                >
                  {(s2 as ServiceCheck)?.status?.toUpperCase() || (loading ? "CHECKING" : "UP")}
                </span>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div className="bg-card2 border border-line p-3 rounded-xl flex items-center justify-between">
                  <span className="text-white/50">Live Response Latency</span>
                  <span className="font-mono font-bold text-sm text-white">
                    {(s2 as ServiceCheck)?.responseTime != null
                      ? `${(s2 as ServiceCheck).responseTime} ms`
                      : "—"}
                  </span>
                </div>

                <div className="bg-card2 border border-line p-3 rounded-xl flex items-center justify-between">
                  <span className="text-white/50">HTTP Status Code</span>
                  <span className="font-mono font-semibold text-white">
                    {(s2 as ServiceCheck)?.httpStatus
                      ? `HTTP ${(s2 as ServiceCheck).httpStatus}`
                      : "—"}
                  </span>
                </div>

                <div className="bg-card2 border border-line p-3 rounded-xl flex items-center justify-between">
                  <span className="text-white/50">Target URL</span>
                  <a
                    href={s2.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-accent hover:underline truncate max-w-[200px]"
                  >
                    {s2.url}
                  </a>
                </div>
              </div>
            </div>

            <Link
              href={`/status/${s2.id}`}
              className="w-full py-2.5 rounded-xl bg-accent text-white text-xs font-bold text-center hover:bg-accent/80 transition-all block"
            >
              View Full {s2.name} Status Page →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-white/40">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
