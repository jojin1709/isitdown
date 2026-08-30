import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { checkUrl } from "@/lib/checker";
import ProblemReport from "@/components/ProblemReport";

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

  const result = await checkUrl(service.url);
  const hostname = service.domain || `${service.id}.com`;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

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
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white mb-8 transition-colors"
      >
        ← Back to all services
      </Link>

      <div className="bg-card border border-line rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-card2 border border-line p-2 flex items-center justify-center shrink-0">
            <img
              src={faviconUrl}
              alt={`${service.name} icon`}
              className="w-8 h-8 object-contain rounded"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{service.name} Status</h1>
            <p className="text-xs text-white/40">{service.category} · {service.url}</p>
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

        <div className="text-xs text-white/40 leading-relaxed">
          IsItDown monitors {service.name} by sending live HTTP status requests directly from our server.
        </div>
      </div>

      <ProblemReport serviceName={service.name} />
    </div>
  );
}
