export type HistoryPoint = {
  time: string;
  responseTime: number;
};

export type RegionLatency = {
  region: string;
  location: string;
  flag: string;
  latency: number;
  status: "up" | "slow" | "down";
};

export function get24HourHistory(serviceId: string, currentResponseTime: number | null): {
  points: HistoryPoint[];
  uptimePercentage: number;
  avgLatency: number;
} {
  const baseLatency = currentResponseTime || 180;
  const points: HistoryPoint[] = [];

  const now = new Date();
  let totalLatency = 0;
  let successfulChecks = 0;
  const totalChecks = 24;

  for (let i = 23; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    const timeStr = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Deterministic pseudo-random variation based on hour & serviceId
    const seed = (serviceId.charCodeAt(0) + i * 17) % 50;
    const variation = seed - 20;
    const responseTime = Math.max(45, baseLatency + variation);

    totalLatency += responseTime;
    successfulChecks += responseTime < 3000 ? 1 : 0;

    points.push({
      time: timeStr,
      responseTime,
    });
  }

  const uptimePercentage = Number(((successfulChecks / totalChecks) * 100).toFixed(1));
  const avgLatency = Math.round(totalLatency / totalChecks);

  return { points, uptimePercentage, avgLatency };
}

export function getMultiRegionStatus(currentResponseTime: number | null): RegionLatency[] {
  const base = currentResponseTime || 180;

  return [
    {
      region: "Asia-South",
      location: "Mumbai, IN",
      flag: "🇮🇳",
      latency: Math.max(35, Math.round(base * 0.4)),
      status: "up",
    },
    {
      region: "US-East",
      location: "N. Virginia, US",
      flag: "🇺🇸",
      latency: Math.max(120, Math.round(base * 1.1)),
      status: "up",
    },
    {
      region: "EU-Central",
      location: "Frankfurt, DE",
      flag: "🇪🇺",
      latency: Math.max(140, Math.round(base * 1.25)),
      status: "up",
    },
  ];
}
