"use client";

import { useState } from "react";
import { AlertOctagon } from "lucide-react";

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
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-card border border-line shrink-0">
          <AlertOctagon className="w-5 h-5 text-down" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Report a problem with {serviceName}</h3>
          <p className="text-xs text-white/50">
            Select which issue you are currently experiencing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
        {ISSUES.map((issue) => {
          const isReported = !!reportedIssues[issue];
          const isLoading = loadingIssue === issue;

          return (
            <button
              key={issue}
              onClick={() => handleReport(issue)}
              disabled={isReported || isLoading}
              className={`p-3 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between ${
                isReported
                  ? "bg-up/10 border-up/40 text-up"
                  : "bg-card border-line text-white/80 hover:border-white/30 hover:text-white"
              }`}
            >
              <span>{issue}</span>
              {isReported ? (
                <span className="text-[10px] font-bold">✓ Reported</span>
              ) : isLoading ? (
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
