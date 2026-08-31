export type HeaderCheckItem = {
  header: string;
  value?: string;
  status: "pass" | "warn" | "fail";
  description: string;
  importance: "High" | "Medium" | "Low";
};

export type SecurityAuditResult = {
  score: number;
  grade: "A+" | "A" | "B" | "C" | "F";
  serverBanner?: string;
  httpVersion?: string;
  compression?: string;
  checks: HeaderCheckItem[];
};

export function auditHeaders(headers: Headers | Record<string, string>): SecurityAuditResult {
  const getHeader = (key: string): string | null => {
    if ("get" in headers && typeof headers.get === "function") {
      return headers.get(key);
    }
    return (headers as Record<string, string>)[key.toLowerCase()] || null;
  };

  const hsts = getHeader("strict-transport-security");
  const csp = getHeader("content-security-policy");
  const xFrame = getHeader("x-frame-options");
  const xContent = getHeader("x-content-type-options");
  const referrer = getHeader("referrer-policy");
  const permissions = getHeader("permissions-policy");
  const server = getHeader("server") || getHeader("x-powered-by") || "Protected / Hidden";
  const encoding = getHeader("content-encoding") || "None (Plain)";
  const altSvc = getHeader("alt-svc");

  const http3Supported = altSvc?.includes("h3") || false;

  const checks: HeaderCheckItem[] = [
    {
      header: "Strict-Transport-Security (HSTS)",
      value: hsts || undefined,
      status: hsts ? "pass" : "fail",
      description: hsts
        ? "Enforces secure HTTPS connections, preventing SSL-stripping attacks."
        : "Missing: Browser may allow insecure plaintext HTTP downgrades.",
      importance: "High",
    },
    {
      header: "Content-Security-Policy (CSP)",
      value: csp ? `${csp.slice(0, 40)}...` : undefined,
      status: csp ? "pass" : "warn",
      description: csp
        ? "Restricts unauthorized script execution to mitigate XSS vulnerabilities."
        : "Missing: Vulnerable to cross-site scripting and malicious script injection.",
      importance: "High",
    },
    {
      header: "X-Frame-Options",
      value: xFrame || undefined,
      status: xFrame ? "pass" : "warn",
      description: xFrame
        ? "Protects users against UI Clickjacking and iframe hijacking."
        : "Missing: Website can potentially be embedded in unauthorized iframes.",
      importance: "Medium",
    },
    {
      header: "X-Content-Type-Options",
      value: xContent || undefined,
      status: xContent?.toLowerCase().includes("nosniff") ? "pass" : "fail",
      description: xContent?.toLowerCase().includes("nosniff")
        ? "Prevents MIME-type sniffing by web browsers."
        : "Missing: Browsers might guess content types insecurely.",
      importance: "Medium",
    },
    {
      header: "Compression (Brotli / Gzip)",
      value: encoding,
      status: encoding.includes("br") || encoding.includes("gzip") ? "pass" : "warn",
      description:
        encoding.includes("br") || encoding.includes("gzip")
          ? `High performance payload compression active (${encoding}).`
          : "Uncompressed response: Page load speeds can be optimized with Brotli/Gzip.",
      importance: "Low",
    },
    {
      header: "HTTP/3 (QUIC) Acceleration",
      value: http3Supported ? "Active (h3)" : "Standard HTTP/2",
      status: http3Supported ? "pass" : "warn",
      description: http3Supported
        ? "Next-gen UDP-based HTTP/3 enabled for ultra-low latency mobile handshakes."
        : "HTTP/2 active. HTTP/3 could further improve mobile connection stability.",
      importance: "Low",
    },
  ];

  let score = 50; // base score
  if (hsts) score += 20;
  if (csp) score += 15;
  if (xFrame) score += 5;
  if (xContent?.toLowerCase().includes("nosniff")) score += 5;
  if (encoding.includes("br") || encoding.includes("gzip")) score += 3;
  if (http3Supported) score += 2;

  score = Math.min(100, Math.max(20, score));

  let grade: "A+" | "A" | "B" | "C" | "F" = "C";
  if (score >= 95) grade = "A+";
  else if (score >= 85) grade = "A";
  else if (score >= 70) grade = "B";
  else if (score >= 50) grade = "C";
  else grade = "F";

  return {
    score,
    grade,
    serverBanner: server,
    httpVersion: http3Supported ? "HTTP/3 (QUIC)" : "HTTP/2",
    compression: encoding,
    checks,
  };
}
