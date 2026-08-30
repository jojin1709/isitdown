import { NextRequest, NextResponse } from "next/server";
import { checkUrl } from "@/lib/checker";

export const dynamic = "force-dynamic";

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
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "Missing ?url=" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(target.protocol) || isBlocked(target.hostname)) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
  }

  const result = await checkUrl(target.toString());

  return NextResponse.json({
    name: target.hostname,
    url: target.toString(),
    ...result,
  });
}
