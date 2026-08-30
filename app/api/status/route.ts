import { NextResponse } from "next/server";
import { SERVICES } from "@/lib/services";
import { checkUrl } from "@/lib/checker";

export const dynamic = "force-dynamic";

let cachedData: { services: any[]; checkedAt: string } | null = null;
let lastFetchedTime = 0;
const CACHE_TTL_MS = 75 * 1000;

export async function GET() {
  const now = Date.now();
  if (cachedData && now - lastFetchedTime < CACHE_TTL_MS) {
    return NextResponse.json(cachedData, {
      headers: { "Cache-Control": "s-maxage=75, stale-while-revalidate=60" },
    });
  }

  const results = await Promise.all(
    SERVICES.map(async (svc) => {
      const result = await checkUrl(svc.url);
      return { ...svc, ...result };
    })
  );

  cachedData = {
    services: results,
    checkedAt: new Date().toISOString(),
  };
  lastFetchedTime = now;

  return NextResponse.json(cachedData, {
    headers: { "Cache-Control": "s-maxage=75, stale-while-revalidate=60" },
  });
}
