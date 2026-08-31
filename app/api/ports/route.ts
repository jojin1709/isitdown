import { NextRequest, NextResponse } from "next/server";
import { scanTargetPorts } from "@/lib/portScanner";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url") || req.nextUrl.searchParams.get("host");
  if (!url) {
    return NextResponse.json({ error: "Missing ?url= or ?host=" }, { status: 400 });
  }

  const ports = await scanTargetPorts(url);
  return NextResponse.json({ host: url, ports });
}
