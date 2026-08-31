"use client";

import { useState } from "react";
import { MessageSquare, Zap, CheckCircle2 } from "lucide-react";

type Props = {
  serviceName?: string;
};

export default function WebhookTester({ serviceName = "All Services" }: Props) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSendTest(e: React.FormEvent) {
    e.preventDefault();
    if (!webhookUrl.trim() || loading) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/webhook/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: webhookUrl.trim(), serviceName }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to dispatch webhook alert");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error sending test alert");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-card border border-line shrink-0">
          <MessageSquare className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            Discord & Slack Outage Webhook Integrations
          </h3>
          <p className="text-xs text-white/50">
            Dispatch real-time incident alerts into your team's private Discord channel or Slack workspace
          </p>
        </div>
      </div>

      <form onSubmit={handleSendTest} className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          required
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://discord.com/api/webhooks/... or https://hooks.slack.com/..."
          className="flex-1 bg-card border border-line rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-bold hover:bg-accent/80 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{loading ? "Dispatching..." : "Send Test Alert"}</span>
        </button>
      </form>

      {success && (
        <div className="mt-3 bg-up/10 border border-up/30 rounded-xl p-3 text-xs text-up font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-up shrink-0" />
          <span>Test alert delivered successfully! Check your Discord / Slack channel.</span>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs text-down font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
