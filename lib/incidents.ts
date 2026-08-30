export type Incident = {
  id: string;
  date: string;
  duration: string;
  severity: "Minor" | "Major" | "Maintenance";
  description: string;
  status: "Resolved" | "Investigating";
};

export function getIncidentHistory(serviceName: string): Incident[] {
  return [
    {
      id: "inc-1",
      date: "August 24, 2026",
      duration: "24 minutes",
      severity: "Minor",
      description: `Elevated HTTP 503 response latency detected across edge gateway nodes for ${serviceName}. Resolving automatically via load balancing fallback.`,
      status: "Resolved",
    },
    {
      id: "inc-2",
      date: "August 12, 2026",
      duration: "45 minutes",
      severity: "Major",
      description: `Upstream DNS resolution timeouts impacted authentication login servers for ${serviceName}. Engine restored service connectivity.`,
      status: "Resolved",
    },
  ];
}
