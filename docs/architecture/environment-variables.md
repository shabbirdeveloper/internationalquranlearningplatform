# Environment-variable checklist

Copy `.env.example` to `.env.local`. Public variables are safe for browser delivery but must never contain privileged credentials.

## Required for local authentication

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | public | Canonical application URL and auth redirect origin. |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | Supabase publishable key used with RLS. |

## Server-only and deferred integrations

| Variable | Phase | Purpose |
|---|---:|---|
| `SUPABASE_SERVICE_ROLE_KEY` | server jobs only | Privileged migrations/background jobs; never browser code. |
| `SENTRY_DSN` | 8 | Server-side error monitoring. |
| `NEXT_PUBLIC_SENTRY_DSN` | 8 | Browser error monitoring. |
| `RESEND_API_KEY` | 6 | Transactional email adapter. |
| `STRIPE_SECRET_KEY` | 5 | Payment API calls. |
| `STRIPE_WEBHOOK_SECRET` | 5 | Webhook signature verification. |
| `ZOOM_ACCOUNT_ID` | 3+ | Zoom server-to-server integration. |
| `ZOOM_CLIENT_ID` | 3+ | Zoom integration client identifier. |
| `ZOOM_CLIENT_SECRET` | 3+ | Zoom integration secret. |
| `GOOGLE_CLIENT_ID` | 3+ | Google Meet OAuth. |
| `GOOGLE_CLIENT_SECRET` | 3+ | Google Meet OAuth secret. |
| `TURNSTILE_SITE_KEY` | 2 | Public CAPTCHA site key. |
| `TURNSTILE_SECRET_KEY` | 2 | CAPTCHA server verification. |

`SUPABASE_SERVICE_ROLE_KEY` is intentionally absent from all client helpers. Deployment environments should scope server-only secrets to the minimum runtime that needs them.

Next.js inlines `NEXT_PUBLIC_*` values into browser bundles. Set the public Supabase values before running a production build, not only when starting the built server.
