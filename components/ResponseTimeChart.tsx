"use client";

import { HistoryPoint } from "@/lib/history";

type Props = {
  points: HistoryPoint[];
  uptimePercentage: number;
  avgLatency: number;
};

export default function ResponseTimeChart({ points, uptimePercentage, avgLatency }: Props) {
  if (!points || points.length === 0) return null;

  const maxVal = Math.max(...points.map((p) => p.responseTime), 300);
  const minVal = Math.min(...points.map((p) => p.responseTime));

  const width = 600;
  const height = 140;
  const padding = 20;

  const svgPoints = points.map((p, idx) => {
    const x = padding + (idx / (points.length - 1)) * (width - padding * 2);
    const y = height - padding - ((p.responseTime - minVal) / (maxVal - minVal || 1)) * (height - padding * 2);
    return { x, y, point: p };
  });

  const pathD = svgPoints.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ""
  );

  const areaD = `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${height - padding} L ${svgPoints[0].x} ${height - padding} Z`;

  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold text-lg">📈</span>
            <h3 className="text-sm font-bold text-white">24-Hour Response Latency</h3>
          </div>
          <p className="text-xs text-white/50">Average response time over the last 24 hours</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-card border border-line px-3 py-1.5 rounded-xl text-xs">
            <span className="text-white/40">24h Avg: </span>
            <span className="font-mono font-bold text-white">{avgLatency} ms</span>
          </div>
          <div className="bg-up/10 border border-up/30 px-3 py-1.5 rounded-xl text-xs font-semibold text-up">
            {uptimePercentage}% Uptime
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B8CFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#5B8CFF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#242A38" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#242A38" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#242A38" />

          {/* Area fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Line path */}
          <path d={pathD} fill="none" stroke="#5B8CFF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Point dots */}
          {svgPoints.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r="3"
              fill="#5B8CFF"
              className="hover:r-5 transition-all cursor-pointer"
            >
              <title>{`${pt.point.time}: ${pt.point.responseTime} ms`}</title>
            </circle>
          ))}
        </svg>

        <div className="flex justify-between text-[10px] text-white/35 font-mono pt-1">
          <span>24h ago</span>
          <span>12h ago</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
}
