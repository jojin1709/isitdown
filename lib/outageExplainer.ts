export type OutageAnalysis = {
  headline: string;
  summary: string;
  faultAttribution: "Origin Server" | "CDN / Cloudflare" | "DNS Authority" | "Network / ISP" | "SSL Provider";
  troubleshootingSteps: string[];
  suggestedCommand?: string;
  severity: "Critical" | "Warning" | "Notice";
};

export function explainOutage(
  status: "up" | "down" | "slow",
  httpStatus: number | null,
  error?: string,
  targetName: string = "Target server"
): OutageAnalysis | null {
  if (status === "up") return null;

  // 1. DNS Resolution Error
  if (
    error?.includes("domain not found") ||
    error?.includes("ENOTFOUND") ||
    error?.includes("getaddrinfo")
  ) {
    return {
      headline: `DNS Resolution Failed for ${targetName}`,
      summary: `The domain name could not be mapped to any server IP address. The domain may have expired, have broken DNS nameservers, or be mistyped.`,
      faultAttribution: "DNS Authority",
      severity: "Critical",
      suggestedCommand: `nslookup ${targetName} 8.8.8.8`,
      troubleshootingSteps: [
        "Double-check domain spelling (e.g. verify the extension .com, .io, .org).",
        "Flush your local DNS resolver cache to clear poisoned entries.",
        "Check WHOIS records to confirm if domain registration is active.",
      ],
    };
  }

  // 2. HTTP 502 Bad Gateway
  if (httpStatus === 502) {
    return {
      headline: `HTTP 502 Bad Gateway (Backend Unreachable)`,
      summary: `The edge proxy / load balancer (e.g. Nginx, Cloudflare, AWS ALB) reached ${targetName}, but received an invalid or terminated response from the upstream application server.`,
      faultAttribution: "Origin Server",
      severity: "Critical",
      troubleshootingSteps: [
        "The upstream Node.js, Python, or PHP process has likely crashed.",
        "Server restart or memory exhaustion is currently in progress.",
        "If you manage this server, check system logs: `sudo journalctl -u app -e`.",
      ],
    };
  }

  // 3. HTTP 503 Service Unavailable / Overloaded
  if (httpStatus === 503) {
    return {
      headline: `HTTP 503 Service Unavailable (Capacity Overload)`,
      summary: `${targetName} is temporarily unable to handle requests due to high traffic spikes, DDoS mitigation, or active database maintenance.`,
      faultAttribution: "Origin Server",
      severity: "Critical",
      troubleshootingSteps: [
        "The web application has exhausted its connection pool or thread limit.",
        "DDoS or flash-crowd traffic spike is triggering rate limiting.",
        "Wait 1–2 minutes; automated autoscaling or cache warmers usually restore service.",
      ],
    };
  }

  // 4. HTTP 504 Gateway Timeout
  if (httpStatus === 504) {
    return {
      headline: `HTTP 504 Gateway Timeout (Origin Unresponsive)`,
      summary: `The frontend proxy contacted ${targetName}, but the origin backend did not respond within the allocated timeout window (typically 30–60s).`,
      faultAttribution: "Origin Server",
      severity: "Critical",
      troubleshootingSteps: [
        "A slow database query or locked table is halting HTTP worker threads.",
        "Origin server CPU/RAM usage may be pinned at 100%.",
        "Restarting backend workers or clearing Redis cache usually resolves this.",
      ],
    };
  }

  // 5. AbortError / Timeout
  if (error === "timed out" || error?.includes("timeout")) {
    return {
      headline: `Connection Timed Out (>8000ms)`,
      summary: `The server failed to respond within 8 seconds. This typically indicates deep server failure, network packet drop, or firewall drop rules.`,
      faultAttribution: "Network / ISP",
      severity: "Critical",
      suggestedCommand: `ping -n 4 ${targetName}`,
      troubleshootingSteps: [
        "The web server ports 80/443 may be blocked by a firewall or routing loop.",
        "Server hosting provider may be undergoing datacenter network outage.",
        "Try testing through a VPN or mobile network to rule out regional ISP routing blocks.",
      ],
    };
  }

  // 6. Slow Response Degradation
  if (status === "slow") {
    return {
      headline: `Elevated Latency & Performance Degradation`,
      summary: `${targetName} is operational but responding unusually slowly (>3000ms latency). Users may experience freezing feeds or delayed page loads.`,
      faultAttribution: "Origin Server",
      severity: "Warning",
      troubleshootingSteps: [
        "Heavy backend database query processing or third-party API dependencies.",
        "Edge CDN cache miss rates may be unusually high.",
        "Server is struggling under elevated concurrent user connections.",
      ],
    };
  }

  // Default unreachable fallback
  return {
    headline: `Server Unreachable or Rejecting Connections`,
    summary: `${targetName} did not accept our HTTP connection. The service may be offline for scheduled maintenance or experiencing an unexpected blackout.`,
    faultAttribution: "Origin Server",
    severity: "Critical",
    suggestedCommand: `curl -Iv https://${targetName}`,
    troubleshootingSteps: [
      "Confirm if the website URL is accessible via mobile data.",
      "Check official social media channels for outage announcements.",
      "Try again in a few minutes after automated load balancers recover.",
    ],
  };
}
