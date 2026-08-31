import { NextRequest, NextResponse } from "next/server";
import { checkUrl } from "@/lib/checker";
import { inspectDomain } from "@/lib/diagnostics";
import { inspectDnsRecords } from "@/lib/dnsInspector";
import { scanTargetPorts } from "@/lib/portScanner";

export const dynamic = "force-dynamic";

// Note: This in-memory rate limiting approach resets on serverless cold starts
// and isn't perfectly accurate across multiple instances, but is good enough to stop
// basic abuse without adding an external dependency.
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();
const MAX_REQUESTS_PER_MINUTE = 10;
const WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }

  record.count += 1;
  return false;
}

const BLOCKED_HOSTS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "169.254.169.254", // cloud metadata endpoint
  "::1",
];

function isBlocked(hostname: string) {
  if (BLOCKED_HOSTS.includes(hostname)) return true;
  // block private IP ranges
  if (/^10\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req as any).ip ||
    "127.0.0.1";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many checks — wait a minute and try again" },
      { status: 429 }
    );
  }

  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing ?url=" }, { status: 400 });
  }

  let formatted = raw.trim();
  // Auto-append .com if user enters a single word without TLD extension (e.g., 'freefire' -> 'freefire.com')
  if (!formatted.includes(".") && !formatted.startsWith("http")) {
    formatted = `${formatted}.com`;
  }

  let target: URL;
  try {
    target = new URL(formatted.startsWith("http") ? formatted : `https://${formatted}`);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(target.protocol) || isBlocked(target.hostname)) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
  }

  const [result, diagnostics, dnsData, portData] = await Promise.all([
    checkUrl(target.toString()),
    inspectDomain(target.toString()).catch(() => undefined),
    inspectDnsRecords(target.hostname).catch(() => undefined),
    scanTargetPorts(target.hostname).catch(() => undefined),
  ]);

  const userAgent = req.headers.get("user-agent") || "";
  const isCurl = userAgent.toLowerCase().startsWith("curl");

  if (isCurl) {
    const isUp = result.status === "up";
    const isSlow = result.status === "slow";
    const statusLabel = isUp ? "\x1b[32m[ OPERATIONAL ]\x1b[0m" : isSlow ? "\x1b[33m[ SLOW RESPONSE ]\x1b[0m" : "\x1b[31m[ DOWN / UNREACHABLE ]\x1b[0m";
    const sslStr = diagnostics?.ssl ? `${diagnostics.ssl.valid ? "\x1b[32mValid\x1b[0m" : "\x1b[31mInvalid\x1b[0m"} (${diagnostics.ssl.issuer}) - Expires in ${diagnostics.ssl.daysRemaining}d` : "None";
    const secStr = result.securityAudit ? `Grade ${result.securityAudit.grade} (${result.securityAudit.score}/100)` : "—";

    const ascii = `
\x1b[36m┌──────────────────────────────────────────────────────────────┐
│  ⚡ IsItDown CLI Prober — Live Server Health Monitor         │
├──────────────────────────────────────────────────────────────┤\x1b[0m
  Target Host:  \x1b[1m${target.hostname}\x1b[0m
  URL:          ${target.toString()}
  Status:       ${statusLabel} ${result.httpStatus ? `(HTTP ${result.httpStatus})` : ""}
  Latency:      \x1b[33m${result.responseTime != null ? `${result.responseTime} ms` : "—"}\x1b[0m
  SSL Protocol: ${sslStr}
  Security:     ${secStr}
  DNS Lookup:   ${diagnostics?.timings.dnsLookupMs ?? "—"} ms
  TTFB:         ${diagnostics?.timings.ttfbMs ?? "—"} ms
\x1b[36m└──────────────────────────────────────────────────────────────┘\x1b[0m
`.trim() + "\n";

    return new NextResponse(ascii, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.json({
    name: target.hostname,
    url: target.toString(),
    ...result,
    diagnostics,
    dnsRecords: dnsData?.records || [],
    ports: portData || [],
  });
}
