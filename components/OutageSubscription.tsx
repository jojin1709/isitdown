"use client";

import { useState } from "react";

type Props = {
  serviceId: string;
  serviceName: string;
};

export default function OutageSubscription({ serviceId, serviceName }: Props) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, serviceId }),
      });
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-accent font-bold text-lg">🔔</span>
        <h3 className="text-sm font-bold text-white">Get Instant Outage Alerts</h3>
      </div>
      <p className="text-xs text-white/50 mb-4">
        Receive an instant email alert if {serviceName} experiences a major downtime:
      </p>

      {subscribed ? (
        <div className="bg-up/10 border border-up/30 rounded-xl p-3.5 text-xs text-up font-semibold flex items-center gap-2">
          <span>✓</span>
          <span>Subscribed! You will be notified if {serviceName} goes down.</span>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex gap-2 flex-col sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="flex-1 bg-card border border-line rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:bg-accent/80 transition-colors shrink-0 disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Notify Me"}
          </button>
        </form>
      )}
    </div>
  );
}
