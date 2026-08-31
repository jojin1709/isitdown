import * as dns from "dns/promises";

export type DnsRecordItem = {
  type: "A" | "AAAA" | "MX" | "NS" | "TXT" | "SOA";
  value: string;
  priority?: number;
};

export type DnsInspectionResult = {
  domain: string;
  records: DnsRecordItem[];
  resolvedAt: string;
  error?: string;
};

export async function inspectDnsRecords(targetDomain: string): Promise<DnsInspectionResult> {
  let hostname = targetDomain;
  try {
    const formatted = targetDomain.startsWith("http")
      ? targetDomain
      : `https://${targetDomain}`;
    hostname = new URL(formatted).hostname;
  } catch {
    hostname = targetDomain;
  }

  const records: DnsRecordItem[] = [];

  const queries = [
    // A records (IPv4)
    dns.resolve4(hostname).then((ips) => {
      ips.forEach((ip) => records.push({ type: "A", value: ip }));
    }).catch(() => {}),

    // AAAA records (IPv6)
    dns.resolve6(hostname).then((ips) => {
      ips.forEach((ip) => records.push({ type: "AAAA", value: ip }));
    }).catch(() => {}),

    // MX records (Mail)
    dns.resolveMx(hostname).then((mxList) => {
      mxList.forEach((mx) =>
        records.push({
          type: "MX",
          value: mx.exchange,
          priority: mx.priority,
        })
      );
    }).catch(() => {}),

    // NS records (Nameservers)
    dns.resolveNs(hostname).then((nsList) => {
      nsList.forEach((ns) => records.push({ type: "NS", value: ns }));
    }).catch(() => {}),

    // TXT records (Verification / SPF / DKIM)
    dns.resolveTxt(hostname).then((txtList) => {
      txtList.forEach((chunks) => {
        const fullTxt = chunks.join(" ");
        records.push({
          type: "TXT",
          value: fullTxt.length > 80 ? `${fullTxt.slice(0, 77)}...` : fullTxt,
        });
      });
    }).catch(() => {}),

    // SOA record (Start of Authority)
    dns.resolveSoa(hostname).then((soa) => {
      records.push({
        type: "SOA",
        value: `Primary NS: ${soa.nsname} · Hostmaster: ${soa.hostmaster}`,
      });
    }).catch(() => {}),
  ];

  await Promise.all(queries);

  return {
    domain: hostname,
    records,
    resolvedAt: new Date().toISOString(),
  };
}
