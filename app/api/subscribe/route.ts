import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, serviceId } = await req.json();
    if (!email || !serviceId) {
      return NextResponse.json({ error: "Missing email or serviceId" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Subscribed ${email} to ${serviceId} alerts` });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
