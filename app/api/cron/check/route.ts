import { NextResponse } from "next/server";
import { SERVICES } from "@/lib/services";
import { checkUrl } from "@/lib/checker";

export const dynamic = "force-dynamic";

export async function GET() {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ skipped: true });
  }

  const downServices: string[] = [];
  const timeStr = new Date().toLocaleTimeString();

  await Promise.all(
    SERVICES.map(async (svc) => {
      const res = await checkUrl(svc.url);
      if (res.status === "down") {
        downServices.push(svc.name);
      }
    })
  );

  if (downServices.length > 0) {
    for (const name of downServices) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `🔴 ${name} appears to be down (checked at ${timeStr})`,
          }),
        });
      } catch (err) {
        console.error(`Failed to send webhook alert for ${name}:`, err);
      }
    }
  }

  return NextResponse.json({ checked: SERVICES.length, down: downServices.length });
}
