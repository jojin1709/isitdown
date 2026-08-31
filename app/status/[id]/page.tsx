import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { checkUrl } from "@/lib/checker";
import { inspectDomain } from "@/lib/diagnostics";
import { getReportsForService } from "@/lib/reports";
import { get24HourHistory } from "@/lib/history";
import { getIncidentHistory } from "@/lib/incidents";
import ReportIssue from "@/components/ReportIssue";
import ResponseTimeChart from "@/components/ResponseTimeChart";
import RegionHeatmap from "@/components/RegionHeatmap";
import BadgeGenerator from "@/components/BadgeGenerator";
import OutageSubscription from "@/components/OutageSubscription";
import IncidentHistory from "@/components/IncidentHistory";
import DiagnosticsCard from "@/components/DiagnosticsCard";
import ShareOutage from "@/components/ShareOutage";
import GlobalContinentProbes from "@/components/GlobalContinentProbes";
import OutageExplainerCard from "@/components/OutageExplainerCard";
import SecurityAuditCard from "@/components/SecurityAuditCard";
import OutageDurationTicker from "@/components/OutageDurationTicker";

export const revalidate = 75;

type Props = {
  params: { id: string };
};

export async function generateStaticParams() {
  return SERVICES.map((service) => ({
    id: service.id,
  }));
}

export async function generateMetadata({ params }: Props) {
  const service = SERVICES.find((s) => s.id === params.id);
  if (!service) return { title: "Service Not Found — IsItDown" };

  return {
    title: `Is ${service.name} down right now? — IsItDown`,
    description: `Check live status and response latency for ${service.name}. Real-time availability monitoring.`,
  };
}

export default async function ServiceStatusPage({ params }: Props) {
  const service = SERVICES.find((s) => s.id === params.id);
  if (!service) {
    notFound();
  }

  const [result, diagnostics] = await Promise.all([
    checkUrl(service.url, service.name),
    inspectDomain(service.url).catch(() => undefined),
  ]);

  const reports = getReportsForService(service.id);
  const history = get24HourHistory(service.id, result.responseTime);
  const incidents = getIncidentHistory(service.name);

  const hostname = service.domain || `${service.id}.com`;
  const faviconUrl = service.useFallbackIcon
    ? null
    : `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;

  const statusLabel =
    result.status === "up"
      ? "Up & Operational"
      : result.status === "slow"
      ? "Up (Slow Response)"
      : "Down / Unreachable";

  const statusColorClass =
    result.status === "up"
      ? "text-up"
      : result.status === "slow"
      ? "text-slow"
      : "text-down";

  const statusDotClass =
    result.status === "up"
      ? "bg-up"
      : result.status === "slow"
      ? "bg-slow"
      : "bg-down";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
        >
          ← Back to all services
        </Link>
        <Link
          href={`/compare?service1=${service.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-semibold"
        >
          ⚖️ Compare with other services
        </Link>
      </div>

      <div className="bg-card border border-line rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-card2 border border-line p-2 flex items-center justify-center shrink-0">
              {faviconUrl ? (
                <img
                  src={faviconUrl}
                  alt={`${service.name} icon`}
                  className="w-8 h-8 object-contain rounded"
                />
              ) : (
                <span className="text-2xl">{service.icon}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{service.name} Status</h1>
              <p className="text-xs text-white/40">{service.category} · {service.url}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <OutageDurationTicker status={result.status} />
            <span className="px-3 py-1.5 rounded-full bg-up/10 border border-up/30 text-up text-xs font-semibold">
              {history.uptimePercentage}% 24h Uptime
            </span>
          </div>
        </div>

        <div className="bg-card2 border border-line rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-white/50">Current Health</span>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${statusDotClass} live-dot`} />
              <span className={`text-base font-bold ${statusColorClass}`}>
                {statusLabel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-line text-xs">
            <div>
              <p className="text-white/40 mb-1">Response Time</p>
              <p className="font-semibold font-mono text-sm">
                {result.responseTime != null ? `${result.responseTime} ms` : "—"}
              </p>
            </div>
            <div>
              <p className="text-white/40 mb-1">HTTP Status</p>
              <p className="font-semibold font-mono text-sm">
                {result.httpStatus ? `HTTP ${result.httpStatus}` : "—"}
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-white/40 mb-1">Last Checked</p>
              <p className="font-mono text-xs text-white/70">
                {new Date(result.checkedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {reports.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-down/10 border border-down/30 text-xs text-white/80">
            <p className="font-bold text-down mb-1">User Issue Reports</p>
            {reports.map((r) => (
              <p key={r.issue}>
                {r.count} {r.count === 1 ? "person" : "people"} reported <span className="font-semibold text-white">{r.issue}</span> in the last hour
              </p>
            ))}
          </div>
        )}

        <div className="text-xs text-white/40 leading-relaxed">
          IsItDown monitors {service.name} by sending live HTTP status requests directly from our server.
        </div>
      </div>

      {result.outageAnalysis && (
        <OutageExplainerCard
          analysis={result.outageAnalysis}
          serviceName={service.name}
        />
      )}

      <ShareOutage
        serviceName={service.name}
        serviceId={service.id}
        url={service.url}
        status={result.status}
        responseTime={result.responseTime}
      />

      <ResponseTimeChart
        points={history.points}
        uptimePercentage={history.uptimePercentage}
        avgLatency={history.avgLatency}
      />

      {diagnostics && (
        <DiagnosticsCard diagnostics={diagnostics} serviceName={service.name} />
      )}

      {diagnostics?.continentProbes && (
        <GlobalContinentProbes
          probes={diagnostics.continentProbes}
          serviceName={service.name}
        />
      )}

      {result.securityAudit && (
        <SecurityAuditCard
          audit={result.securityAudit}
          serviceName={service.name}
        />
      )}

      <RegionHeatmap serviceName={service.name} />

      <ReportIssue serviceId={service.id} serviceName={service.name} />

      <OutageSubscription serviceId={service.id} serviceName={service.name} />

      <BadgeGenerator serviceId={service.id} serviceName={service.name} />

      <IncidentHistory incidents={incidents} serviceName={service.name} />
    </div>
  );
}
