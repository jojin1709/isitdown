"use client";

import { useState } from "react";

type Props = {
  serviceId: string;
  serviceName: string;
};

const ISSUES = [
  "App / Mobile",
  "Login / Auth",
  "Server Connection",
  "Website",
  "Payments / Checkout",
  "Posting / Content",
];

export default function ReportIssue({ serviceId, serviceName }: Props) {
  const [reportedIssues, setReportedIssues] = useState<Record<string, boolean>>({});
  const [loadingIssue, setLoadingIssue] = useState<string | null>(null);

  async function handleReport(issue: string) {
    if (reportedIssues[issue] || loadingIssue) return;
    setLoadingIssue(issue);

    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, issue }),
      });
      setReportedIssues((prev) => ({ ...prev, [issue]: true }));
    } catch {
      // Ignore network errors on client reporting
    } finally {
      setLoadingIssue(null);
    }
  }

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-down font-bold text-lg">!</span>
        <h3 className="text-sm font-bold text-white">Report a problem with {serviceName}</h3>
      </div>
      <p className="text-xs text-white/50 mb-4">
        Select which issue you are currently experiencing:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {ISSUES.map((issue) => {
          const isReported = !!reportedIssues[issue];
          const isLoading = loadingIssue === issue;

          return (
            <button
              key={issue}
              onClick={() => handleReport(issue)}
              disabled={isReported || isLoading}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                isReported
                  ? "bg-down/20 border-down text-down cursor-not-allowed opacity-90"
                  : "bg-card border-line text-white/70 hover:border-white/20 hover:text-white disabled:opacity-50"
              }`}
            >
              <span>{issue}</span>
              {isReported ? (
                <span className="text-down text-xs font-bold">✓ Thanks, reported</span>
              ) : isLoading ? (
                <span className="text-white/40 text-xs">Reporting...</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
