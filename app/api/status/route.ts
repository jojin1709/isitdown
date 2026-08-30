import { NextResponse } from "next/server";
import { SERVICES } from "@/lib/services";
import { checkUrl } from "@/lib/checker";

export const dynamic = "force-dynamic";

export async function GET() {
  const results = await Promise.all(
    SERVICES.map(async (svc) => {
      const result = await checkUrl(svc.url);
      return { ...svc, ...result };
    })
  );

  return NextResponse.json(
    { services: results, checkedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "s-maxage=90, stale-while-revalidate=60" } }
  );
}
