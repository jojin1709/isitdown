import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { webhookUrl, serviceName } = await req.json();

    if (!webhookUrl || !webhookUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "Please enter a valid Discord or Slack webhook URL" },
        { status: 400 }
      );
    }

    const name = serviceName || "Monitored Service";
    const nowStr = new Date().toUTCString();

    const isSlack = webhookUrl.includes("hooks.slack.com");

    const payload = isSlack
      ? {
          text: `🚨 *[IsItDown Alert]*: *${name}* connectivity outage test incident at ${nowStr}`,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `🚨 *[IsItDown Incident Alert]*\n*Target:* ${name}\n*Status:* DOWN / Test Alert\n*Timestamp:* ${nowStr}\n*Verification:* <https://isitdown-live.vercel.app|IsItDown Monitor>`,
              },
            },
          ],
        }
      : {
          username: "IsItDown Alert Bot",
          avatar_url: "https://isitdown-live.vercel.app/icon.svg",
          embeds: [
            {
              title: `🚨 Outage Incident Alert: ${name}`,
              description: `Automated test notification from **IsItDown Live Monitoring**. If an actual outage occurs, webhook alerts will be delivered immediately to this channel.`,
              color: 16731501, // Red
              fields: [
                { name: "Service", value: name, inline: true },
                { name: "Status", value: "🔴 Outage Test", inline: true },
                { name: "Timestamp", value: nowStr, inline: false },
              ],
              footer: { text: "IsItDown Autonomous Uptime Prober" },
            },
          ],
        };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Webhook server returned HTTP ${res.status}. Check your webhook URL.` },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to reach webhook destination" },
      { status: 500 }
    );
  }
}
