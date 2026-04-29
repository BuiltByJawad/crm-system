# Cloudflare Free Tier Deployment Guide

To deploy this entire project for free on Cloudflare, we will use **Cloudflare Pages** for the frontend.

## 1. Prerequisites
- A [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- Your code pushed to a **GitHub** repository.

## 2. Setup Cloudflare Pages (Recommended)
Cloudflare Pages is the easiest way to deploy Next.js for free.

1. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select your `crm-system` repository.
3. **Crucial Build Settings**:
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`
4. **Environment Variables**:
   - In the Cloudflare Dashboard, go to your Project > **Settings** > **Environment variables**.
   - Add `NODE_VERSION` with value `20`.
5. **Compatibility Flags**:
   - Go to **Settings** > **Functions**.
   - Under **Compatibility flags**, add `nodejs_compat` to both **Production** and **Preview**.

## 3. Why the build failed (and how to fix)
If you see an error about `opennextjs-cloudflare deploy` or `WORKER_SELF_REFERENCE`:
Cloudflare sometimes tries to automatically migrate Next.js projects to its new "OpenNext" worker format. **For a free deployment, we want to stick to the standard Pages format.**

- **DO NOT** run `npx wrangler deploy` manually if prompted during build.
- **DO NOT** commit the `wrangler.jsonc` or `open-next.config.ts` files if they were generated locally, as they can conflict with the Pages build.

## 4. Database (Free)
Since this is a free deployment, the app currently uses **Mock Data** in production mode when no database is connected. 

To use a real database for free:
1. Create a [Supabase](https://supabase.com) or [Neon](https://neon.tech) project (both have great free tiers).
2. Get your connection string.
3. Add `DATABASE_URL` to your Cloudflare Pages **Environment Variables**.
4. Redeploy.

## Cost Summary: $0.00
- **Cloudflare Pages**: Free (Unlimited bandwidth)
- **Database (Supabase/Neon)**: Free (Up to 500MB)
