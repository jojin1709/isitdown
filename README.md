# IsItDown

Live status checker — is Amazon down, is Instagram down, or is it just you.
No login, no database required. Checks run live against each service every
time the page loads and every 60 seconds after.

## How it works

- `lib/services.ts` — the list of tracked services (30+ defaults: social,
  shopping, streaming, dev/AI, India-specific, finance)
- `lib/checker.ts` — the actual check: sends a HEAD (falls back to GET)
  request with a browser user-agent and an 8s timeout, times the response,
  and classifies it:
  - **down** — no response, timed out, or the server itself failed (502/503/504)
  - **slow** — responded, but took over 3 seconds
  - **up** — responded normally (even a 403/404 counts as "up" — the server
    answered, which is what matters here, not whether that exact request
    was allowed)
- `/api/status` — checks every default service in parallel, returns them all
- `/api/check?url=` — checks any custom URL a user types in, with basic
  guards against pinging localhost/private IPs

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push to a GitHub repo
2. vercel.com → New Project → import the repo
3. Framework preset: Next.js (auto-detected)
4. Deploy

No environment variables needed — this one just works out of the box.

## Editing things

- Add/remove tracked services in `lib/services.ts`
- Change timeout/slow-threshold in `lib/checker.ts`
- Polling interval is `POLL_MS` in `components/Dashboard.tsx` (default 60s)

## Notes

- Some sites (banking apps, a few social platforms) actively block
  server-to-server requests regardless of status — if one shows "down" but
  is actually fine for you, it likely means that specific site blocks
  Vercel's IP ranges, not that it's genuinely down. This is inherent to any
  server-side status checker (including commercial ones).
- For real historical uptime graphs (not just live snapshot), you'd want to
  add a cron job (Vercel Cron, free) that logs each check to a database
  (Supabase, free tier) every few minutes. Not included here to keep this
  fully zero-config — ask if you want that added.
