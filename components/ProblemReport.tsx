import ReportIssue from "./ReportIssue";

export default function ProblemReport({ serviceId, serviceName }: { serviceId: string; serviceName: string }) {
  return <ReportIssue serviceId={serviceId} serviceName={serviceName} />;
}
