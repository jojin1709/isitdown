// Note: In-memory report storage resets on serverless cold starts and redeploys.
// This is a lightweight MVP counter, not persistent storage.
export type ReportEntry = {
  issue: string;
  count: number;
  lastReported: string;
};

export const reportsMap = new Map<string, Map<string, { count: number; lastReported: string }>>();

export function addReport(serviceId: string, issue: string): number {
  if (!reportsMap.has(serviceId)) {
    reportsMap.set(serviceId, new Map());
  }

  const serviceReports = reportsMap.get(serviceId)!;
  const current = serviceReports.get(issue) || { count: 0, lastReported: new Date().toISOString() };

  const newCount = current.count + 1;
  serviceReports.set(issue, {
    count: newCount,
    lastReported: new Date().toISOString(),
  });

  return newCount;
}

export function getReportsForService(serviceId: string): ReportEntry[] {
  const serviceReports = reportsMap.get(serviceId);
  if (!serviceReports) return [];

  const reports: ReportEntry[] = [];
  for (const [issue, data] of serviceReports.entries()) {
    reports.push({
      issue,
      count: data.count,
      lastReported: data.lastReported,
    });
  }
  return reports;
}
