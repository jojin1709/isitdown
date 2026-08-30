import { NextRequest, NextResponse } from "next/server";
import { SERVICES } from "@/lib/services";
import { checkUrl } from "@/lib/checker";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const serviceId = req.nextUrl.searchParams.get("serviceId");
  const rawUrl = req.nextUrl.searchParams.get("url");

  let label = "Status";
  let targetUrl = "https://google.com";

  if (serviceId) {
    const service = SERVICES.find((s) => s.id === serviceId);
    if (service) {
      label = service.name;
      targetUrl = service.url;
    }
  } else if (rawUrl) {
    label = rawUrl;
    targetUrl = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
  }

  const result = await checkUrl(targetUrl);

  const isUp = result.status === "up";
  const isSlow = result.status === "slow";

  const badgeColor = isUp ? "#3DDC84" : isSlow ? "#FFC93D" : "#FF4D6D";
  const statusText = isUp
    ? `UP ${result.responseTime ? `${result.responseTime}ms` : ""}`
    : isSlow
    ? `SLOW ${result.responseTime ? `${result.responseTime}ms` : ""}`
    : "DOWN";

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="210" height="28" viewBox="0 0 210 28" fill="none">
  <rect width="210" height="28" rx="6" fill="#131722" stroke="#242A38" stroke-width="1"/>
  <text x="12" y="18" fill="#FFFFFF" fill-opacity="0.6" font-family="Inter, sans-serif" font-size="11" font-weight="600">IsItDown</text>
  <line x1="75" y1="6" x2="75" y2="22" stroke="#242A38"/>
  <text x="85" y="18" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="11" font-weight="700">${label.length > 12 ? label.substring(0, 10) + '..' : label}</text>
  <circle cx="162" cy="14" r="4" fill="${badgeColor}"/>
  <text x="172" y="18" fill="${badgeColor}" font-family="Inter, sans-serif" font-size="11" font-weight="700">${statusText}</text>
</svg>
`.trim();

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
