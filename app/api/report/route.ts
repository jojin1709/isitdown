import { NextRequest, NextResponse } from "next/server";
import { addReport, getReportsForService } from "@/lib/reports";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, issue } = body || {};

    if (!serviceId || !issue) {
      return NextResponse.json({ error: "Missing serviceId or issue" }, { status: 400 });
    }

    const count = addReport(serviceId, issue);
    return NextResponse.json({ success: true, count });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const serviceId = req.nextUrl.searchParams.get("serviceId");

  if (!serviceId) {
    return NextResponse.json({ reports: [] });
  }

  const reports = getReportsForService(serviceId);
  return NextResponse.json({ reports });
}
