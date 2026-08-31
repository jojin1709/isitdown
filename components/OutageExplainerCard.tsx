"use client";

import { OutageAnalysis } from "@/lib/outageExplainer";

type Props = {
  analysis?: OutageAnalysis | null;
  serviceName?: string;
};

export default function OutageExplainerCard({ analysis, serviceName }: Props) {
  if (!analysis) return null;

  const isCritical = analysis.severity === "Critical";

  return (
    <div
      className={`border rounded-2xl p-6 mt-6 ${
        isCritical
          ? "bg-down/10 border-down/40"
          : "bg-slow/10 border-slow/40"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isCritical ? "🧠" : "🔍"}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white">
                AI Diagnostic & Root Cause Breakdown
              </h3>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isCritical ? "bg-down text-white" : "bg-slow text-black"
                }`}
              >
                {analysis.severity}
              </span>
            </div>
            <p className="text-xs text-white/50">{analysis.headline}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-card border border-line text-xs">
          <span className="text-white/40">Fault Attribution:</span>
          <span className="font-bold text-white">{analysis.faultAttribution}</span>
        </div>
      </div>

      <div className="bg-card border border-line rounded-xl p-4 mb-4 text-xs text-white/80 leading-relaxed">
        <p>{analysis.summary}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-white flex items-center gap-1.5">
          <span>🛠️</span>
          <span>Troubleshooting & Next Steps</span>
        </p>

        <ul className="space-y-1.5 text-xs text-white/70 list-disc list-inside">
          {analysis.troubleshootingSteps.map((step, idx) => (
            <li key={idx} className="leading-normal">
              {step}
            </li>
          ))}
        </ul>

        {analysis.suggestedCommand && (
          <div className="mt-3 pt-2 border-t border-line/60 flex items-center justify-between gap-2 flex-wrap text-xs">
            <span className="text-white/50 text-[11px]">Diagnostic Command:</span>
            <code className="bg-card2 border border-line px-3 py-1 rounded-lg font-mono text-accent select-all">
              {analysis.suggestedCommand}
            </code>
          </div>
        )}
      </div>
    </div>
  );
}
