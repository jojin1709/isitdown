import { auditHeaders, SecurityAuditResult } from "./headerAudit";
import { explainOutage, OutageAnalysis } from "./outageExplainer";

export type CheckResult = {
  status: "up" | "down" | "slow";
  responseTime: number | null;
  httpStatus: number | null;
  checkedAt: string;
  error?: string;
  securityAudit?: SecurityAuditResult;
  outageAnalysis?: OutageAnalysis | null;
};

const TIMEOUT_MS = 8000;
const SLOW_THRESHOLD_MS = 3000;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

export async function checkUrl(url: string, serviceName?: string): Promise<CheckResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let res: Response;
    try {
      // Try GET first with full browser headers for strict WAFs (IRCTC, banks)
      res = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
        headers: BROWSER_HEADERS,
        cache: "no-store",
      });
    } catch {
      // Fallback attempt with HEAD
      res = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
        redirect: "follow",
        headers: BROWSER_HEADERS,
        cache: "no-store",
      });
    }

    const responseTime = Date.now() - start;
    clearTimeout(timer);

    const isDown = [502, 503, 504].includes(res.status);
    const status = isDown ? "down" : responseTime > SLOW_THRESHOLD_MS ? "slow" : "up";

    const securityAudit = auditHeaders(res.headers);
    const outageAnalysis = explainOutage(status, res.status, undefined, serviceName || new URL(url).hostname);

    return {
      status,
      responseTime,
      httpStatus: res.status,
      checkedAt: new Date().toISOString(),
      securityAudit,
      outageAnalysis,
    };
  } catch (err: any) {
    clearTimeout(timer);

    const isDnsError =
      err?.code === "ENOTFOUND" ||
      err?.cause?.code === "ENOTFOUND" ||
      err?.cause?.syscall === "getaddrinfo" ||
      (typeof err?.message === "string" &&
        (err.message.includes("ENOTFOUND") ||
          err.message.includes("getaddrinfo") ||
          err.message.includes("Failed to parse URL") ||
          err.message.includes("invalid URL")));

    let errorMessage = "unreachable";
    if (err?.name === "AbortError") {
      errorMessage = "timed out";
    } else if (isDnsError) {
      errorMessage = "domain not found";
    }

    let hostname = "Target server";
    try {
      hostname = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
    } catch {
      hostname = url;
    }

    const outageAnalysis = explainOutage("down", null, errorMessage, serviceName || hostname);

    return {
      status: "down",
      responseTime: null,
      httpStatus: null,
      checkedAt: new Date().toISOString(),
      error: errorMessage,
      outageAnalysis,
    };
  }
}
