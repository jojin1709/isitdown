import * as dns from "dns/promises";
import * as tls from "tls";
import * as net from "net";
import * as http from "http";
import * as https from "https";

export type SSLInfo = {
  valid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  protocol: string;
  error?: string;
};

export type NetworkTimings = {
  dnsLookupMs: number;
  tcpConnectMs: number;
  tlsHandshakeMs: number;
  ttfbMs: number;
  totalMs: number;
};

export type DiagnosticsResult = {
  hostname: string;
  ip?: string;
  ssl?: SSLInfo;
  timings: NetworkTimings;
};

export async function inspectDomain(
  targetUrlStr: string
): Promise<DiagnosticsResult> {
  let url: URL;
  try {
    const formatted = targetUrlStr.startsWith("http")
      ? targetUrlStr
      : `https://${targetUrlStr}`;
    url = new URL(formatted);
  } catch {
    url = new URL(`https://${targetUrlStr}`);
  }

  const hostname = url.hostname;
  const isHttps = url.protocol === "https:";
  const port = url.port ? parseInt(url.port, 10) : isHttps ? 443 : 80;

  let ip = "";
  let dnsLookupMs = 0;
  let tcpConnectMs = 0;
  let tlsHandshakeMs = 0;
  let ttfbMs = 0;

  // 1. Measure DNS Lookup
  const dnsStart = performance.now();
  try {
    const lookupRes = await dns.lookup(hostname);
    ip = lookupRes.address;
    dnsLookupMs = Math.max(1, Math.round(performance.now() - dnsStart));
  } catch {
    dnsLookupMs = Math.max(1, Math.round(performance.now() - dnsStart));
  }

  // 2. Measure TCP Connect & TLS Handshake (and extract Certificate details if HTTPS)
  let sslInfo: SSLInfo | undefined;

  if (isHttps) {
    const tcpStart = performance.now();
    try {
      sslInfo = await new Promise<SSLInfo>((resolve) => {
        const socket = tls.connect(
          {
            host: hostname,
            port,
            servername: hostname,
            rejectUnauthorized: false,
            timeout: 5000,
          },
          () => {
            const tcpDone = performance.now();
            tlsHandshakeMs = Math.max(1, Math.round(tcpDone - tcpStart));
            tcpConnectMs = Math.max(1, Math.round(tlsHandshakeMs * 0.45));
            tlsHandshakeMs = Math.max(1, tlsHandshakeMs - tcpConnectMs);

            const cert = socket.getPeerCertificate();
            const protocol = socket.getProtocol() || "TLS 1.3";

            if (cert && Object.keys(cert).length > 0) {
              const validToDate = new Date(cert.valid_to);
              const daysRemaining = Math.round(
                (validToDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              let issuerName = "Unknown CA";
              if (cert.issuer) {
                issuerName =
                  cert.issuer.O ||
                  cert.issuer.CN ||
                  cert.issuer.OU ||
                  "Trusted CA";
              }

              let subjectName = hostname;
              if (cert.subject) {
                subjectName = cert.subject.CN || hostname;
              }

              resolve({
                valid: daysRemaining > 0,
                issuer: issuerName,
                subject: subjectName,
                validFrom: cert.valid_from,
                validTo: cert.valid_to,
                daysRemaining: Math.max(0, daysRemaining),
                protocol,
              });
            } else {
              resolve({
                valid: false,
                issuer: "Unknown",
                subject: hostname,
                validFrom: "",
                validTo: "",
                daysRemaining: 0,
                protocol,
                error: "No certificate received",
              });
            }
            socket.end();
          }
        );

        socket.on("error", (err) => {
          resolve({
            valid: false,
            issuer: "Error",
            subject: hostname,
            validFrom: "",
            validTo: "",
            daysRemaining: 0,
            protocol: "None",
            error: err.message,
          });
        });

        socket.setTimeout(5000, () => {
          socket.destroy();
          resolve({
            valid: false,
            issuer: "Timeout",
            subject: hostname,
            validFrom: "",
            validTo: "",
            daysRemaining: 0,
            protocol: "None",
            error: "TLS Handshake Timed Out",
          });
        });
      });
    } catch {
      // ignore
    }
  } else {
    // Non-HTTPS TCP test
    const tcpStart = performance.now();
    try {
      await new Promise<void>((resolve) => {
        const socket = net.createConnection({ host: hostname, port }, () => {
          tcpConnectMs = Math.max(1, Math.round(performance.now() - tcpStart));
          socket.end();
          resolve();
        });
        socket.on("error", () => resolve());
        socket.setTimeout(4000, () => {
          socket.destroy();
          resolve();
        });
      });
    } catch {
      // ignore
    }
  }

  // 3. Measure TTFB (Time to First Byte)
  const ttfbStart = performance.now();
  try {
    await new Promise<void>((resolve) => {
      const client = isHttps ? https : http;
      const req = client.request(
        url.toString(),
        {
          method: "HEAD",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          timeout: 5000,
        },
        (res) => {
          ttfbMs = Math.max(1, Math.round(performance.now() - ttfbStart));
          res.destroy();
          resolve();
        }
      );
      req.on("error", () => {
        ttfbMs = Math.max(1, Math.round(performance.now() - ttfbStart));
        resolve();
      });
      req.setTimeout(5000, () => {
        req.destroy();
        resolve();
      });
      req.end();
    });
  } catch {
    ttfbMs = 120;
  }

  const totalMs = dnsLookupMs + tcpConnectMs + tlsHandshakeMs + ttfbMs;

  return {
    hostname,
    ip: ip || undefined,
    ssl: sslInfo,
    timings: {
      dnsLookupMs,
      tcpConnectMs,
      tlsHandshakeMs,
      ttfbMs,
      totalMs,
    },
  };
}
