> [!NOTE]
> **[IsItDown Live Uptime Monitor](https://isitdown-live.vercel.app) — Developed by [Jojin John](https://github.com/jojin1709)**

<div align="center">

# IsItDown

### IsItDown is an autonomous, real-time website availability & server health checker.

Developed by **[Jojin John](https://github.com/jojin1709)**.

It performs live HTTP server connectivity checks against 40+ global and regional services, measures response latency, and lets users check any custom URL instantly.

**[🌐 Access Live Application: https://isitdown-live.vercel.app](https://isitdown-live.vercel.app)**

---

</div>

> [!TIP]
> **Live Deployment Active:** Access the live application directly at **[isitdown-live.vercel.app](https://isitdown-live.vercel.app)**. No registration or installation required.

## Table of Contents

- [What is IsItDown?](#what-is-isitdown)
- [Live Application](#live-application)
- [Live Status Tracker](#live-status-tracker)
- [Key Capabilities](#key-capabilities)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Configuration & Customization](#configuration--customization)
- [Author](#author)
- [License](#license)

## What is IsItDown?

IsItDown is a modern status monitoring application built by **Jojin John** and inspired by tools like Downdetector. It helps users answer one fundamental question: **"Is a service actually down, or is it just my internet connection?"**

Instead of relying on crowd-sourced speculation alone, IsItDown executes real-time server-to-server HTTP HEAD/GET probes against target endpoints. It measures latency in milliseconds, inspects HTTP response status codes, and classifies service health into clear operational states.

### Why IsItDown Exists

Commercial status pages are often slow to report outages or hidden behind login walls. IsItDown provides an instant, zero-login dashboard that automatically checks 40+ major platforms—including Social Media, E-Commerce, Streaming, Dev/AI tools, Telecom, and Indian Banking institutions—every 60 seconds.

## Live Application

The application is deployed live and maintained by **Jojin John**:

- **Primary Web URL**: [https://isitdown-live.vercel.app](https://isitdown-live.vercel.app)
- **Deployment Platform**: Vercel

> [!IMPORTANT]
> The live application refreshes automatically every 60 seconds and allows testing any custom website URL live on demand.

## Live Status Tracker

IsItDown monitors 40+ services across key categories out of the box:

| Category | Tracked Services |
| --- | --- |
| **Social** | Instagram, Facebook, WhatsApp, X (Twitter), Snapchat, Discord, Telegram, Reddit, LinkedIn |
| **Shopping** | Amazon, Amazon India, Flipkart, Myntra, eBay |
| **Streaming** | YouTube, Netflix, Spotify, Prime Video, Disney+ Hotstar, Twitch |
| **Dev / AI** | Google Gemini, ChatGPT, Claude, GitHub, Vercel, Google, Gmail |
| **India & Telecom** | Jio, Airtel, Vi (Vodafone Idea), BSNL, IRCTC, Paytm, PhonePe, UPI (NPCI) |
| **Finance & Banking** | State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, PayPal |

## Key Capabilities

- **Real-Time HTTP Probing**: Executes dual-stage HEAD requests (falling back to GET) with browser User-Agent headers to detect server health accurately.
- **Live Interactive Outage World Map (`/map`)**: Full-screen interactive SVG world map showing Edge probe telemetry, active incident epicenters, and latency radar waves.
- **Public DNS Records Inspector**: Live Node.js DNS resolver inspecting A, AAAA, MX, NS, TXT, and SOA records for any domain.
- **TCP Port & Service Scanner**: Real-time socket scanner testing Port 22 (SSH), 80/443 (Web), 3306/5432 (Databases), 587/993 (Mail), and 8080/3000 (Custom Apps).
- **1-Click "Proof of Outage" SLA Incident Exporter**: Generates downloadable high-resolution SLA verification certificate images with UTC timestamps, response latency, HTTP codes, and cryptographic incident hashes.
- **Predictive Outage Risk & Latency Anomaly Detector**: Real-time jitter and variance calculator measuring standard deviation to forecast degradation risk.
- **Discord & Slack Webhook Instant Alerts**: In-app webhook tester and live alert dispatcher delivering embed incident notifications directly to team channels.
- **Multi-Continent Global Ping Probes**: Real-time Edge DNS and ping latency probes across 5 continents (North America, Europe, Asia-Pacific, Oceania, South America).
- **AI Outage Reason & Root Cause Explainer**: Automatically classifies server failures (502 Bad Gateway, 503 Overload, 504 Timeout, DNS NXDOMAIN) with plain-English fault attribution and troubleshooting terminal commands.
- **"Is It Just You?" Local Connection & ISP Diagnostics**: 1-click in-browser network benchmark measuring local Wi-Fi latency, jitter, and DNS health to verify whether connectivity issues are local or remote.
- **Live Outage Duration Stopwatch**: Real-time ticker tracking active downtime duration (e.g. *"Down for 14m 20s"*) updating live without page reloads.
- **Security & HTTP Headers Health Audit**: Evaluates HSTS, Content-Security-Policy (CSP), X-Frame-Options, Brotli compression, and HTTP/3 QUIC support with a standardized Security Grade (A+ to F).
- **Terminal CLI & `curl` Quick Access**: Developers can query live statuses directly from their terminal using `curl isitdown-live.vercel.app/api/check?url=github.com` for formatted ASCII/ANSI outputs.
- **SSL Certificate & DNS Inspector**: Deep server-side diagnostics inspecting SSL certificate validity, issuing authority, expiry date countdown, and a 4-phase network latency waterfall (DNS Lookup ➔ TCP Connect ➔ TLS Handshake ➔ TTFB).
- **Global Outage Live Banner**: Real-time persistent incident banner highlighting multi-platform degradation and ongoing service outages.
- **1-Click Outage Sharing**: Instantly post live outage statuses and diagnostic results to Twitter/X, WhatsApp, LinkedIn, Reddit, or clipboard.
- **Head-to-Head Comparison Tool (`/compare`)**: Side-by-side availability and latency benchmarking between competing platforms (e.g. *ChatGPT vs Claude*, *Amazon vs Flipkart*, *Jio vs Airtel*).
- **SEO & Discovery Engine**: Expanded `sitemap.ts` and `robots.ts` indexing with crawler rules for Googlebot, Bingbot, Twitterbot, Discordbot, and dynamic OpenGraph share preview cards generated via `@vercel/og` (`next/og`).
- **Official Brand Favicons**: Automatically fetches high-resolution brand logos via Google Favicon API with fallback icons.
- **Server-Side In-Memory Caching**: Caches batch `/api/status` checks for 75 seconds to prevent serverless function rate-limiting and ensure rapid response times.
- **Custom Domain Checker with Rate Limiting**: Enables users to query any arbitrary website live with built-in per-IP rate limiting (10 checks/minute) and SSRF protection against private IP ranges (`127.0.0.1`, `10.x`, `192.168.x`).
- **Per-Service SEO Pages**: Pre-renders dedicated `/status/[id]` static/dynamic pages with custom Open Graph title tags (*"Is {ServiceName} down right now? — IsItDown"*).
- **Interactive Problem Reporting**: Allows visitors to report specific issues (App, Login, Server Connection, Feed, Website, Payments) per service.
- **Automated Webhook Alerts**: Includes `/api/cron/check` endpoint compatible with Vercel Cron to send Discord or Slack notifications when outages occur.
- **Smart Sorting & Filtering**: Sort by **Status** (Down first ➔ Slow ➔ Up) or **Speed** (Response Time ascending).

## Architecture

IsItDown follows Next.js App Router architecture with decoupled checking logic and caching layers:

```text
┌──────────────────────────────────────────────────────────┐
│                   Next.js App Router                     │
├────────────────────────────┬─────────────────────────────┤
│      Frontend Client       │       API Route Handler     │
│   (Dashboard, StatusCard,  │   (/api/status, /api/check, │
│    CustomCheck, Filter)    │    /api/cron/check)        │
└─────────────┬──────────────┴──────────────┬──────────────┘
              │                             │
              ▼                             ▼
┌───────────────────────────┐ ┌─────────────────────────────┐
│   SEO Per-Service Pages   │ │     Checker Core Engine     │
│      (/status/[id])       │ │      (lib/checker.ts)       │
└───────────────────────────┘ └──────────────┬──────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │   Target Web Servers      │
                               │  (40+ Tracked & Custom)   │
                               └───────────────────────────┘
```

At a high level:
- **`lib/services.ts`**: Defines tracked services, URLs, categories, and domain mappings.
- **`lib/checker.ts`**: Handles timeout-managed fetch requests (8s timeout, 3s slow threshold) and classifies responses (`up`, `slow`, `down`).
- **`app/api/status/route.ts`**: Executes parallel checks across all 40+ endpoints with 75-second in-memory caching.
- **`app/api/check/route.ts`**: Processes custom URL checks with SSRF validation and IP rate limiting.
- **`app/status/[id]/page.tsx`**: Dynamic server-side SEO route per tracked service.

## API Endpoints

### 1. Batch Status Check (`GET /api/status`)
Returns the health status for all default tracked services. Cached server-side for 75 seconds.

**Response:**
```json
{
  "services": [
    {
      "id": "instagram",
      "name": "Instagram",
      "url": "https://www.instagram.com",
      "category": "Social",
      "domain": "instagram.com",
      "status": "up",
      "responseTime": 215,
      "httpStatus": 200,
      "checkedAt": "2026-08-30T14:55:00.000Z"
    }
  ],
  "checkedAt": "2026-08-30T14:55:00.000Z"
}
```

### 2. Custom URL Check (`GET /api/check?url=example.com`)
Checks any custom user-submitted URL. Enforces 10 requests/minute per IP rate limit.

**Response:**
```json
{
  "name": "example.com",
  "url": "https://example.com",
  "status": "up",
  "responseTime": 142,
  "httpStatus": 200,
  "checkedAt": "2026-08-30T14:55:05.000Z"
}
```

### 3. Downtime Cron Check (`GET /api/cron/check`)
Triggers an outage scan. If `ALERT_WEBHOOK_URL` is set, posts a notification to Discord/Slack for any down services.

## Configuration & Customization

| Item | File Location | Description |
| --- | --- | --- |
| **Add/Remove Services** | [`lib/services.ts`](lib/services.ts) | Modify the `SERVICES` array to add custom domains or categories. |
| **Timeouts & Slow Thresholds** | [`lib/checker.ts`](lib/checker.ts) | Adjust `TIMEOUT_MS` (default 8s) or `SLOW_THRESHOLD_MS` (default 3s). |
| **Auto-Polling Frequency** | [`components/Dashboard.tsx`](components/Dashboard.tsx) | Change `POLL_MS` (default 60000ms / 60 seconds). |
| **Webhook Alerts** | `.env.local` | Set `ALERT_WEBHOOK_URL=https://discord.com/api/webhooks/...` (optional). |

## Author

IsItDown is designed and developed by **Jojin John**.
- **GitHub**: [@jojin1709](https://github.com/jojin1709)
- **Live Site**: [https://isitdown-live.vercel.app](https://isitdown-live.vercel.app)

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <b>Developed by <a href="https://github.com/jojin1709">Jojin John</a></b>
</p>
