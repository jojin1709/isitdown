import * as net from "net";

export type PortStatus = {
  port: number;
  service: string;
  category: "Web" | "Remote" | "Database" | "Mail" | "App";
  status: "open" | "closed" | "filtered";
  latencyMs: number;
};

const TARGET_PORTS: { port: number; service: string; category: PortStatus["category"] }[] = [
  { port: 443, service: "HTTPS (Web)", category: "Web" },
  { port: 80, service: "HTTP (Web)", category: "Web" },
  { port: 22, service: "SSH (Terminal)", category: "Remote" },
  { port: 587, service: "SMTP (Mail)", category: "Mail" },
  { port: 993, service: "IMAP (Mail)", category: "Mail" },
  { port: 3306, service: "MySQL", category: "Database" },
  { port: 5432, service: "PostgreSQL", category: "Database" },
  { port: 8080, service: "App Proxy", category: "App" },
  { port: 3000, service: "Node Server", category: "App" },
];

export async function checkPort(host: string, port: number): Promise<{ status: "open" | "closed" | "filtered"; latencyMs: number }> {
  const start = performance.now();

  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isResolved = false;

    socket.setTimeout(2500);

    socket.on("connect", () => {
      if (!isResolved) {
        isResolved = true;
        const latencyMs = Math.max(1, Math.round(performance.now() - start));
        socket.destroy();
        resolve({ status: "open", latencyMs });
      }
    });

    socket.on("error", (err: any) => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        const latencyMs = Math.max(1, Math.round(performance.now() - start));
        if (err.code === "ECONNREFUSED") {
          resolve({ status: "closed", latencyMs });
        } else {
          resolve({ status: "filtered", latencyMs });
        }
      }
    });

    socket.on("timeout", () => {
      if (!isResolved) {
        isResolved = true;
        socket.destroy();
        resolve({ status: "filtered", latencyMs: 2500 });
      }
    });

    try {
      socket.connect(port, host);
    } catch {
      if (!isResolved) {
        isResolved = true;
        resolve({ status: "filtered", latencyMs: 2500 });
      }
    }
  });
}

export async function scanTargetPorts(targetHost: string): Promise<PortStatus[]> {
  let hostname = targetHost;
  try {
    const formatted = targetHost.startsWith("http") ? targetHost : `https://${targetHost}`;
    hostname = new URL(formatted).hostname;
  } catch {
    hostname = targetHost;
  }

  const results = await Promise.all(
    TARGET_PORTS.map(async (p) => {
      const res = await checkPort(hostname, p.port);
      return {
        port: p.port,
        service: p.service,
        category: p.category,
        status: res.status,
        latencyMs: res.latencyMs,
      };
    })
  );

  return results;
}
