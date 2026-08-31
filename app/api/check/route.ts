import { NextRequest, NextResponse } from "next/server";
import { checkUrl } from "@/lib/checker";
import { inspectDomain } from "@/lib/diagnostics";

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

  const [result, diagnostics] = await Promise.all([
    checkUrl(target.toString()),
    inspectDomain(target.toString()).catch(() => undefined),
  ]);

  return NextResponse.json({
    name: target.hostname,
    url: target.toString(),
    ...result,
    diagnostics,
  });
}
