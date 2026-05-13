# Florioin Ops Hub

> **Internal use only.** This is Carlos Anaya's personal AI department for operating FlorioIn. It is **not** part of the FlorioIn product, has no public users, and lives behind a founder-only allowlist.

---

## What this is

A separate Next.js app (`ops.florioin.app`) that acts as a virtual department for the founder of FlorioIn:

- **Sales VP** drafts cross-channel replies (email · WhatsApp · LinkedIn via Apollo)
- **Marketing Director** monitors GA4 / GSC / social
- **Content Planner** plans LinkedIn / IG / TikTok weekly (founder publishes manually)
- **Finance Analyst** tracks MRR / trials / churn
- **Product Health** watches Vercel / Sentry / FlorioIn DB
- **Customer Success** detects low-engagement trials
- **Chief of Staff** consolidates everything into a CEO Daily Brief at 7:30am MX

Every AI output is **humanistic** (founder voice, MX Spanish, no templates, no competitor names, no invented customers) and **never sent without explicit approval** via the in-app queue.

## Repo structure

```
florioin-ops/
├── apps/
│   └── ops/                  # Next.js 16 App Router app (the Hub UI)
├── packages/
│   ├── ops-core/             # Shared logic (ingestors, processors, mocks, prompts)
│   ├── ops-db/               # Supabase types + SQL migrations for schema `ops`
│   └── ops-ui/               # Liquid Glass design system
├── package.json              # pnpm workspace root
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── .env.example
```

## Database

The Hub uses the **same Supabase instance** as the FlorioIn product (`ref: heqzwommoufzqoprybyq`) but in a fully isolated schema:

| Schema    | Hub access                                    |
| --------- | --------------------------------------------- |
| `ops`     | Read + write (this is the Hub's home)         |
| `public`  | **Read-only** general                         |
| `public.florioin_ops_flags` | **Read + write** (only writable surface in `public`) |

RLS is enforced everywhere: only `carlos@florioin.app` can read/write Hub data.

## Build phases

| Phase | What                                            | Status |
| ----- | ----------------------------------------------- | ------ |
| 1     | Foundation (this) — repo, schema, auth, layout  | **Done** |
| 2     | Schema migrations applied + mock seed (90 days) | Next   |
| 3     | UI core: Overview, Actions, Content             | —      |
| 4     | Tier-1 ingestors (mock) + Conversations UI      | —      |
| 5     | AI processors + Reports + Content Planner       | —      |
| 6     | Deployment + sharing + backups                  | —      |
| 7     | Flip mock → real APIs one integration at a time | —      |
| 8     | Polish + observability                          | —      |

## Phase 1 deliverables

- pnpm workspace with three packages (`ops-core`, `ops-db`, `ops-ui`) + `apps/ops`
- Next.js 16 App Router app with strict TypeScript
- 12 placeholder routes (Overview, Sales, Conversations, Contacts, Actions, **Content**, Marketing, Finance, Product, Insights, Reports, Settings) + sub-routes
- Florioin Liquid Glass design system (cream canvas, obsidian sidebar, glass cards, brand gradient)
- Supabase migration `0001_init_ops_schema.sql` creating schema `ops` + RLS policies + `public.florioin_ops_flags`
- Magic Link auth (founder-only) with middleware enforcement
- `/api/health` healthcheck

## Local setup

### Prereqs

- Node.js 22+ (Vercel runtime; `24.x` locally is fine)
- pnpm 9+
- A `.env.local` derived from `.env.example`

### Install

```bash
pnpm install
```

### Apply DB migration (Phase 2 will automate this; for now do it manually)

In the Supabase Dashboard SQL Editor for project `heqzwommoufzqoprybyq`, paste the contents of:

```
packages/ops-db/migrations/0001_init_ops_schema.sql
```

This creates the `ops` schema, all tables, indexes, and RLS policies. The migration is idempotent (`IF NOT EXISTS` everywhere).

### Configure env

```bash
cp .env.example .env.local
```

Fill in (at minimum for Phase 1):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://heqzwommoufzqoprybyq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase Dashboard → Project Settings → API>
SUPABASE_SERVICE_ROLE_KEY=<server-only, never expose>
USE_MOCK_DATA=true
NEXT_PUBLIC_FOUNDER_EMAIL=carlos@florioin.app
```

### Run

```bash
pnpm dev
# → http://localhost:3000
```

You'll be redirected to `/login`. Enter `carlos@florioin.app`, click "Mandarme magic link", check your inbox, click the link. You land on the Overview.

### Useful scripts

```bash
pnpm dev          # apps/ops dev server (Turbopack, port 3000)
pnpm build        # production build of apps/ops
pnpm lint         # eslint across the workspace
pnpm typecheck    # tsc --noEmit across all packages
pnpm format       # prettier write
```

## Hard rules (do not violate)

These are enforced by the system prompts in Phase 5, but they live here too as a contract:

1. **AI never sends anything without explicit founder approval.** Approval flow is non-negotiable.
2. **No competitor names** in any AI output (ClickUp, Asana, Notion, etc.).
3. **No invented customers / metrics / features.** Honesty over polish.
4. **Pricing is hardcoded:** $5 USD/seat monthly, $4 USD/seat annual. No tiers, no discounts, no refunds, no extended trials.
5. **Humanistic voice:** MX Spanish, founder-to-founder, ≤80 words on cold initial emails.
6. **Hub never auto-publishes to social.** AI plans content; Carlos publishes manually from phone.
7. **Daily email limit:** 200 max.
8. **Founder-only access.** Only `carlos@florioin.app` can pass the allowlist.

## Sub-domain (Phase 6)

`ops.florioin.app` — separate Vercel project, CNAME to Vercel, region `iad1`. Not deployed yet.

---

**Status:** Phase 1 complete. Awaiting founder validation before starting Phase 2.
