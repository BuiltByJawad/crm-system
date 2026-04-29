# CRM Deployment Guide

This project supports **two deployment paths**. Choose based on your needs.

---

## Path A: Free Tier (Cloudflare Only) — No Credit Card

**Stack**: Cloudflare Pages + Workers + D1 (SQLite)

| Layer | Service | Free Limits |
|---|---|---|
| Frontend | Cloudflare Pages | Unlimited sites, 500 builds/mo |
| Backend API | Cloudflare Worker | 100K req/day, 10ms CPU |
| Database | Cloudflare D1 | 5 DBs, 5GB, 5M rows read/day |
| Cache | Cloudflare KV | 100K reads/day |

### Prerequisites
- Cloudflare account (free, no credit card)
- Wrangler CLI installed (`npm install -g wrangler`)

### Step 1: Create D1 Database
```bash
npm run db:create
# Copy the database_id from output
```

Update `wrangler.toml` — replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with the actual ID.

### Step 2: Run Migrations
```bash
# Local testing
npm run db:migrate:local

# Production
npm run db:migrate:remote
```

### Step 3: Deploy the Worker API
```bash
npm run deploy:worker
# Note the URL, e.g. https://crm-api.YOUR-SUBDOMAIN.workers.dev
```

### Step 4: Deploy Frontend on Cloudflare Pages
1. Go to **Workers & Pages → Create → Pages → Connect to Git**
2. Select your `crm-system` repo
3. Build settings:
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`
4. **Environment variables**:
   - `NEXT_PUBLIC_API_URL` = `https://crm-api.YOUR-SUBDOMAIN.workers.dev/api/v1`
5. **Settings → Functions → Compatibility flags**: add `nodejs_compat`

### Step 5: Set Worker Secrets
```bash
wrangler secret put JWT_SECRET
# Enter a strong secret (min 8 chars)
```

### Local Development (Worker)
```bash
npm run dev:worker    # Starts Worker on http://localhost:8787
npm run dev           # Starts Next.js on http://localhost:3000
```

---

## Path B: Production (Express + PostgreSQL) — Requires Hosting

**Stack**: Cloudflare Pages / Vercel + Express API + PostgreSQL

| Layer | Service | Options |
|---|---|---|
| Frontend | Cloudflare Pages or Vercel | Free tier |
| Backend API | Render / Railway / Fly.io / VPS | Paid or credit card |
| Database | Neon / Supabase / Managed Postgres | Free tiers available |

### Prerequisites
- Hosting with Node.js runtime (for Express)
- PostgreSQL database (managed or self-hosted)
- Credit card may be required for some hosts

### Step 1: Set Up PostgreSQL
Create a database and get the connection string:
```
DATABASE_URL=postgresql://user:password@host:5432/crm
```

### Step 2: Run Prisma Migrations
```bash
npx prisma migrate deploy
npx prisma db seed
```

### Step 3: Deploy Express API
On your hosting platform (Render, Railway, etc.):
- **Build command**: `npm install`
- **Start command**: `npm run start:api`
- **Environment variables**:
  - `DATABASE_URL` = your Postgres connection string
  - `JWT_SECRET` = a strong secret (32+ chars)
  - `PORT` = `3001` (or as required)

### Step 4: Deploy Frontend
On Cloudflare Pages or Vercel:
- **Build command**: `npm run build`
- **Output directory**: `.next` (Vercel) or `.vercel/output/static` (Pages)
- **Environment variables**:
  - `NEXT_PUBLIC_API_URL` = `https://your-api-host.com/api/v1`
  - `DATABASE_URL` = your Postgres connection string
  - `JWT_SECRET` = your JWT secret

### Local Development (Express)
```bash
npm run dev:api       # Starts Express API on http://localhost:3001
npm run dev           # Starts Next.js on http://localhost:3000
```

---

## Local Docker Deployment

This repository includes a `docker-compose.yml` that starts:

- Postgres
- Redis
- API (Express)
- Web (Next.js)

```bash
docker compose up --build
```

Services:
- Web: `http://localhost:3000`
- API: `http://localhost:3001`

---

## Switching Between Paths

The project keeps **both backends** in the repo:
- `src/api-server/` — Express + Prisma (production)
- `src/worker/` — Hono + Drizzle + D1 (free Cloudflare)

Switch by changing **one environment variable**:
- `NEXT_PUBLIC_API_URL` → points to whichever backend is running

No code changes needed. The frontend API client (`src/lib/api/client.ts`) reads this variable.

### Quick Reference

| Want to... | Set NEXT_PUBLIC_API_URL to |
|---|---|
| Use Cloudflare Worker | `https://crm-api.YOUR-SUBDOMAIN.workers.dev/api/v1` |
| Use Express API | `https://your-api-host.com/api/v1` |
| Use mock/dev mode | Leave empty (defaults to `http://localhost:3001/api/v1`) |

---

## Architecture Comparison

```
PATH A (Free - Cloudflare)          PATH B (Production)
┌─────────────────────┐             ┌─────────────────────┐
│  Cloudflare Pages   │             │  Cloudflare Pages    │
│  (Next.js Frontend) │             │  or Vercel          │
└─────────┬───────────┘             └─────────┬───────────┘
          │ NEXT_PUBLIC_API_URL               │ NEXT_PUBLIC_API_URL
┌─────────▼───────────┐             ┌─────────▼───────────┐
│  Cloudflare Worker   │             │  Express API Server  │
│  (Hono + Drizzle)    │             │  (Prisma ORM)        │
└─────────┬───────────┘             └─────────┬───────────┘
          │ D1 binding                         │ DATABASE_URL
┌─────────▼───────────┐             ┌─────────▼───────────┐
│  Cloudflare D1       │             │  PostgreSQL          │
│  (SQLite)            │             │  (Neon/Supabase/...) │
└─────────────────────┘             └─────────────────────┘
```

---

## Troubleshooting

### Cloudflare Pages build fails with Prisma error
- Ensure `DATABASE_URL` and `JWT_SECRET` env vars are **optional** (they are in current config)
- The build runs `prisma generate && next build` — Prisma generate only creates types, no DB connection needed

### Worker deploy fails with WORKER_SELF_REFERENCE
- This happens when using `npx wrangler deploy` as a Pages deploy command
- **Solution**: Use Pages build settings only (no deploy command), or deploy Worker separately via `npm run deploy:worker`

### D1 database not found
- Run `npm run db:create` first
- Copy the `database_id` into `wrangler.toml`

### Node version mismatch on Cloudflare
- `.nvmrc` is set to `20`
- `.node-version` is set to `20`
- `engines.node` requires `>=20.19.0`
