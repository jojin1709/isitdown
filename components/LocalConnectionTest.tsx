"use client";

import { useState } from "react";
import { Wifi, Activity, Zap } from "lucide-react";

type TestResult = {
  latency: number;
  jitter: number;
  status: "excellent" | "good" | "poor";
  verdict: string;
};

export default function LocalConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  async function runTest() {
    setTesting(true);
    setResult(null);

    const latencies: number[] = [];

    try {
      // Execute 3 consecutive probe rounds
      for (let i = 0; i < 3; i++) {
        const start = performance.now();
        await fetch(`/api/ping?t=${Date.now()}_${i}`, { cache: "no-store" });
        const round = performance.now() - start;
        latencies.push(round);
        await new Promise((r) => setTimeout(r, 100));
      }

      const avgLatency = Math.round(
        latencies.reduce((a, b) => a + b, 0) / latencies.length
      );
      const jitter = Math.round(
        Math.max(...latencies) - Math.min(...latencies)
      );

      let status: "excellent" | "good" | "poor" = "excellent";
      let verdict =
        "Your internet connection is fast and stable. If a website fails to load, it is almost certainly a remote server outage.";

      if (avgLatency > 200 || jitter > 100) {
        status = "poor";
        verdict =
          "High network latency or Wi-Fi jitter detected. Site timeouts might be due to your local connection or ISP routing.";
      } else if (avgLatency > 80) {
        status = "good";
        verdict =
          "Your connection is operational with moderate latency. Web browsing should work normally.";
      }

      setResult({
        latency: avgLatency,
        jitter,
        status,
        verdict,
      });
    } catch {
      setResult({
        latency: 0,
        jitter: 0,
        status: "poor",
        verdict: "Could not reach the test gateway. Check your local Wi-Fi or internet connection.",
      });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="bg-card2 border border-line rounded-2xl p-5 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-card border border-line shrink-0">
            <Wifi className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Is It Just You? Test Your Internet & ISP
            </h3>
            <p className="text-xs text-white/50">
              Run a quick ping and packet stability benchmark from your current browser
            </p>
          </div>
        </div>

        <button
          onClick={runTest}
          disabled={testing}
          className="px-4 py-2 rounded-xl bg-card border border-line hover:border-accent text-white text-xs font-semibold disabled:opacity-50 transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          {testing ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span>Pinging Gateway...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span>Run Connection Test</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="mt-4 pt-4 border-t border-line">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-line p-4 rounded-xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    result.status === "excellent"
                      ? "bg-up"
                      : result.status === "good"
                      ? "bg-slow"
                      : "bg-down"
                  }`}
                />
                <span className="text-xs font-bold text-white">
                  {result.status === "excellent"
                    ? "Connection Healthy (No Local Issues)"
                    : result.status === "good"
                    ? "Connection Moderate"
                    : "Unstable Connection"}
                </span>
              </div>
              <p className="text-xs text-white/70 max-w-xl">{result.verdict}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono shrink-0">
              <div>
                <p className="text-white/40 text-[10px]">Ping</p>
                <p className="font-bold text-white text-sm">{result.latency} ms</p>
              </div>
              <div className="border-l border-line pl-4">
                <p className="text-white/40 text-[10px]">Jitter</p>
                <p className="font-bold text-white text-sm">{result.jitter} ms</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
