# Mosambi — Next.js Edition

Daily tasks, reminders, and multi-day challenges with streaks, XP/levels, badges,
dark mode, mood-based backgrounds, deadline alerts, CSV/JSON download, and a share button —
now with real accounts (Clerk) and a real database (Neon Postgres via Prisma).

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Clerk** — sign up / log in / profile picture (DP), session management
- **Neon** (serverless Postgres) + **Prisma** — all tasks, challenges, XP, badges, mood images
- Plain CSS (no component library) matching the original mosambi-orange design

## 1. Clone & install
```bash
npm install
```

## 2. Set up Clerk (auth + profile photo)
1. Create a free app at https://dashboard.clerk.com
2. Copy the **Publishable key** and **Secret key** into `.env` (see `.env.example`)
3. In Clerk's dashboard, under **User & Authentication → Email, Phone, Username**, make sure
   email + password (or whatever methods you want) are enabled.
4. Profile pictures are built into Clerk — no extra setup needed. Users can upload a DP:
   - during sign-up if you enable "Profile image" under **User & Authentication → Personal Information**, or
   - any time afterward by clicking their avatar (top-right of the dashboard) → **Manage account**.

## 3. Set up Neon (database)
1. Create a free project at https://console.neon.tech
2. Copy the **pooled** connection string into `DATABASE_URL` in `.env`
3. Push the schema (creates all tables — no separate migration step needed for a fresh project):
   ```bash
   npx prisma db push
   ```
   (Optional) Browse your data with `npx prisma studio`.

## 4. Run it
```bash
cp .env.example .env   # then fill in your real keys
npm run dev
```
Visit http://localhost:3000 → Sign up → you'll land on `/dashboard`.

## 5. Deploy (e.g. Vercel)
1. Push this folder to a GitHub repo
2. Import it on https://vercel.com
3. Add the same environment variables from `.env` in the Vercel project settings
4. Deploy — Vercel runs `prisma generate` automatically via the `build` script

## What's included

| Feature | Where |
|---|---|
| Sign up / log in / sessions | Clerk (`/sign-in`, `/sign-up`, `middleware.ts`) |
| Profile picture (DP) | Clerk's built-in `<UserButton />` — click the avatar to upload/change |
| Tasks & reminders (CRUD) | `app/api/tasks/*`, stored in Neon via Prisma |
| Multi-day challenges (7/21/45/75/100/120/custom) | `app/api/challenges/*` |
| Daily streak | Computed client-side from tasks in `DashboardClient.tsx` |
| XP, levels, badges | Server-awarded on completion (`app/api/tasks/[id]`, `.../checkin`) |
| Dark mode | Toggled + persisted via `PATCH /api/user` |
| Mood backgrounds (upload your own photo) | `app/api/user/mood-image`, images stored as compressed base64 in Neon |
| "Every second counts" ticker | Rotating quotes + live clock in `DashboardClient.tsx` |
| Deadline alerts | Browser `Notification` API + in-app toast fallback (polls every 15s) |
| Download tasks & challenges | `GET /api/export?format=json\|csv` |
| Share progress | Web Share API with clipboard fallback |
| Descending sort | Today's list sorts latest-time-first; challenges sort newest-started-first |

## Notes & next steps
- **Notifications**: browsers only fire real push notifications while the tab is open (no
  service worker is set up here). For true background/mobile push, add a service worker +
  Web Push subscription table — happy to help wire that up if you want it.
- **Mood images**: stored as base64 text in Postgres for simplicity. If you start uploading
  many/large photos, swap `MoodImage.dataUrl` for a proper object store (Vercel Blob, S3,
  Cloudinary) and store a URL instead — much cheaper at scale.
- **Public share links**: the current Share button shares a text summary. If you want a
  public read-only page (e.g. `mosambi.app/u/username/streak`), that needs a public route
  that doesn't require Clerk auth plus a "make this public" toggle — a good v2 feature.
