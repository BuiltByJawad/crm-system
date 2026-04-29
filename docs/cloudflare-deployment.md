# Cloudflare Free Tier Deployment Guide

To deploy this entire project for free on Cloudflare, we will use **Cloudflare Pages** for the frontend and **Cloudflare Workers** (with D1 and KV) for the backend.

## 1. Prerequisites
- A [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- Your code pushed to a **GitHub** or **GitLab** repository.

## 2. Frontend: Cloudflare Pages (Free)
Cloudflare Pages natively supports Next.js via the `@cloudflare/next-on-pages` adapter.

1. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your repository.
3. Use these build settings:
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`
4. In the Cloudflare Dashboard, go to your Project > **Settings** > **Functions** > **Compatibility flags** and add `nodejs_compat`.

## 3. Backend: Cloudflare Workers + D1 (Free)
Since your current backend uses Express and PostgreSQL, you'll need to adapt it to Cloudflare's serverless environment.

### Database: Cloudflare D1
Cloudflare D1 is a serverless SQL database (SQLite based) that is completely free up to 5M rows read/day.
1. Create a D1 database: `npx wrangler d1 create crm-db`
2. Update your `schema.prisma` to use the `sqlite` provider for the edge.

### Cache: Cloudflare Workers KV
Instead of Redis, use **Workers KV** for session/token blacklisting. It is free up to 100k reads/day.

### API: Cloudflare Workers
Instead of a long-running Express server, you can deploy your API logic as a Worker.
1. Use `hono` or similar lightweight frameworks that run on Workers.
2. Deploy using `wrangler deploy`.

## 4. Environment Variables
In the Cloudflare Dashboard for your Pages project:
- `NEXT_PUBLIC_API_URL`: Your Workers URL.
- `JWT_SECRET`: A long random string.

## 5. Deployment Architecture
- **Frontend**: Next.js App (Pages)
- **API**: Cloudflare Workers
- **DB**: Cloudflare D1 (SQL)
- **Cache**: Cloudflare KV

## Cost Summary: $0.00
- **Cloudflare Pages**: Free (Unlimited requests/bandwidth)
- **Cloudflare Workers**: Free (100k requests/day)
- **Cloudflare D1**: Free (5M rows read/day)
- **Cloudflare KV**: Free (100k reads/day)
