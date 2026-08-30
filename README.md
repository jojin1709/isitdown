> [!NOTE]
> **[IsItDown Live Uptime Monitor](https://github.com/jojin1709/isitdown) — Developed by [Jojin John](https://github.com/jojin1709)**

<div align="center">

# IsItDown

### IsItDown is an autonomous, real-time website availability & server health checker.

Developed by **[Jojin John](https://github.com/jojin1709)**.

It performs live HTTP server connectivity checks against 40+ global and regional services, measures response latency, and lets users check any custom URL instantly.

**This repository is the full open-source Next.js 14 App Router codebase, ready to run locally or deploy to Vercel.**

---

</div>

> [!TIP]
> **Zero Configuration Required:** Works out of the box with zero external database dependencies. Simply clone, run `npm run dev`, or deploy directly to Vercel.

## Table of Contents

- [What is IsItDown?](#what-is-isitdown)
- [Live Status Tracker](#live-status-tracker)
- [Quick Start](#quick-start)
- [Key Capabilities](#key-capabilities)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Deployment Guide](#deployment-guide)
- [Configuration & Customization](#configuration--customization)
- [Author](#author)
- [License](#license)
- [Common Questions](#common-questions)

## What is IsItDown?

IsItDown is a modern, full-stack Next.js status monitoring application built by **Jojin John** and inspired by tools like Downdetector. It helps users answer one fundamental question: **"Is a service actually down, or is it just my internet connection?"**

Instead of relying on crowd-sourced speculation alone, IsItDown executes real-time server-to-server HTTP HEAD/GET probes against target endpoints. It measures latency in milliseconds, inspects HTTP response status codes, and classifies service health into clear operational states.

### Why IsItDown Exists

Commercial status pages are often slow to report outages or hidden behind login walls. IsItDown provides an instant, zero-login, open-source dashboard that automatically checks 40+ major platforms—including Social Media, E-Commerce, Streaming, Dev/AI tools, Telecom, and Indian Banking institutions—every 60 seconds.

## Live Status Tracker

IsItDown monitors 40+ services across key categories out of the box:

| Category | Tracked Services |
| --- | --- |
| **Social** | Instagram, Facebook, WhatsApp, X (Twitter), Snapchat, Discord, Telegram, Reddit, LinkedIn, Free Fire |
| **Shopping** | Amazon, Amazon India, Flipkart, Myntra, eBay |
| **Streaming** | YouTube, Netflix, Spotify, Prime Video, Disney+ Hotstar, Twitch |
| **Dev / AI** | Google Gemini, ChatGPT, Claude, GitHub, Vercel, Google, Gmail |
| **India & Telecom** | Jio, Airtel, Vi (Vodafone Idea), BSNL, IRCTC, Paytm, PhonePe, UPI (NPCI) |
| **Finance & Banking** | State Bank of India (SBI), HDFC Bank, ICICI Bank, Axis Bank, PayPal |

## Quick Start

### Prerequisites

- **Node.js 18.x or higher**
- **npm** or **yarn** / **pnpm**

### Run Locally

> [!WARNING]
> Ensure your network allows outbound HTTP/HTTPS requests on ports 80 and 443 so status checks can reach target servers.

```bash
# Clone the repository
git clone https://github.com/jojin1709/isitdown.git

# Navigate into the project folder
cd isitdown

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the live status dashboard.

> [!TIP]
> **Production Build:**
> Run `npm run build` followed by `npm start` to test the production server build locally.

## Key Capabilities

- **Real-Time HTTP Probing**: Executes dual-stage HEAD requests (falling back to GET) with browser User-Agent headers to detect server health accurately.
- **Official Brand Favicons**: Automatically fetches high-resolution brand logos via Google Favicon API with emoji fallbacks.
- **Server-Side In-Memory Caching**: Caches batch `/api/status` checks for 75 seconds to prevent serverless function rate-limiting and ensure rapid response times.
- **Custom Domain Checker with Rate Limiting**: Enables users to query any arbitrary website live with built-in per-IP rate limiting (10 checks/minute) and SSRF protection against private IP ranges (`127.0.0.1`, `10.x`, `192.168.x`).
- **Per-Service SEO Pages**: Pre-renders dedicated `/status/[id]` static/dynamic pages with custom Open Graph title tags (*"Is {ServiceName} down right now? — IsItDown"*).
- **Interactive Problem Reporting**: Allows visitors to report specific issues (App, Login, Server Connection, Feed, Website, Payments) per service.
- **Automated Webhook Alerts**: Includes `/api/cron/check` endpoint compatible with Vercel Cron to send Discord or Slack notifications when outages occur.
- **Smart Sorting & Filtering**: Automatically floats **Down** and **Slow** services to the top of the dashboard for immediate visibility.

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

## Deployment Guide

### Deploying to Vercel (Recommended)

1. Push your repository to GitHub:
   ```bash
   git push origin master
   ```
2. Go to **[vercel.com](https://vercel.com)** ➔ **New Project** ➔ Import `isitdown`.
3. Vercel automatically detects Next.js. Click **Deploy**.

> [!NOTE]
> **Vercel Cron Note:** The included `vercel.json` configures a daily cron job (`0 0 * * *`) compatible with Vercel's Hobby free tier.

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

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <b>Developed by <a href="https://github.com/jojin1709">Jojin John</a></b>
</p>
