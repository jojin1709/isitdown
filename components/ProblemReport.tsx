"use client";

import { useState } from "react";

type Props = {
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

export default function ProblemReport({ serviceName }: Props) {
  const [reported, setReported] = useState<string | null>(null);

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
        {ISSUES.map((issue) => (
          <button
            key={issue}
            onClick={() => setReported(issue)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
              reported === issue
                ? "bg-down/20 border-down text-down shadow-lg shadow-down/10"
                : "bg-card border-line text-white/70 hover:border-white/20 hover:text-white"
            }`}
          >
            <span>{issue}</span>
            {reported === issue && <span className="text-down text-xs">✓ Reported</span>}
          </button>
        ))}
      </div>

      {reported && (
        <p className="text-xs text-up mt-4 bg-up/10 border border-up/20 rounded-xl px-4 py-2.5 font-medium">
          Thank you for reporting an issue with {reported}. Your feedback helps keep status checks accurate!
        </p>
      )}
    </div>
  );
}
