export type CheckResult = {
  status: "up" | "down" | "slow";
  responseTime: number | null;
  httpStatus: number | null;
  checkedAt: string;
  error?: string;
};

const TIMEOUT_MS = 8000;
const SLOW_THRESHOLD_MS = 3000;

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export async function checkUrl(url: string): Promise<CheckResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let res: Response;
    try {
      // Try HEAD first - cheaper, faster
      res = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
        redirect: "follow",
        headers: { "User-Agent": BROWSER_UA },
        cache: "no-store",
      });
    } catch {
      // Some servers reject HEAD outright - fall back to GET
      res = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        redirect: "follow",
        headers: { "User-Agent": BROWSER_UA },
        cache: "no-store",
      });
    }

    const responseTime = Date.now() - start;
    clearTimeout(timer);

    // A 4xx/most 5xx still means "the server answered" - the site is up.
    // Only true server failure (502/503/504) or no response at all means down.
    const isDown = [502, 503, 504].includes(res.status);

    if (isDown) {
      return {
        status: "down",
        responseTime,
        httpStatus: res.status,
        checkedAt: new Date().toISOString(),
      };
    }

    return {
      status: responseTime > SLOW_THRESHOLD_MS ? "slow" : "up",
      responseTime,
      httpStatus: res.status,
      checkedAt: new Date().toISOString(),
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

    return {
      status: "down",
      responseTime: null,
      httpStatus: null,
      checkedAt: new Date().toISOString(),
      error: errorMessage,
    };
  }
}
