"use client";

type CityBreakdown = {
  city: string;
  country: string;
  reports: number;
  percentage: number;
};

const CITIES: CityBreakdown[] = [
  { city: "Mumbai", country: "India 🇮🇳", reports: 42, percentage: 38 },
  { city: "Delhi NCR", country: "India 🇮🇳", reports: 28, percentage: 25 },
  { city: "Bengaluru", country: "India 🇮🇳", reports: 21, percentage: 19 },
  { city: "London", country: "UK 🇬🇧", reports: 12, percentage: 11 },
  { city: "New York", country: "US 🇺🇸", reports: 8, percentage: 7 },
];

export default function RegionHeatmap({ serviceName }: { serviceName: string }) {
  return (
    <div className="bg-card2 border border-line rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-down font-bold text-lg">🗺️</span>
          <h3 className="text-sm font-bold text-white">Outage Report Heatmap</h3>
        </div>
        <span className="text-xs text-white/40 font-mono">111 total reports today</span>
      </div>
      <p className="text-xs text-white/50 mb-4">
        Top cities reporting connectivity issues for {serviceName}:
      </p>

      <div className="space-y-3">
        {CITIES.map((c) => (
          <div key={c.city} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-white/80">{c.city} <span className="text-white/40 font-normal">({c.country})</span></span>
              <span className="text-white/60 font-mono">{c.percentage}%</span>
            </div>
            <div className="w-full bg-card rounded-full h-2 overflow-hidden border border-line">
              <div
                className="bg-gradient-to-r from-accent to-down h-full rounded-full transition-all"
                style={{ width: `${c.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
