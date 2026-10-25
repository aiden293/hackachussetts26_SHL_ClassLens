# Tech Stack & Conventions

## Stack

- **Next.js 16** (App Router, Turbopack, Cache Components enabled) with
  **TypeScript**
- **Tailwind CSS v4** (design tokens in `src/app/globals.css`: `--brand`,
  `--brand-ink`, `--rating-ink`, `--positive/neutral/negative`, etc. — BU red)
- **Clerk** (`@clerk/nextjs`) for authentication
- **Supabase** client libraries scaffolded for future DB/storage (not yet the
  auth system)
- Client-side state providers (React context + localStorage) for demo features:
  auth adapter, saved courses, course edits, user reviews, discussions

## Commands

- `npm run dev` — dev server (do not run long-lived servers in automation)
- `npm run build` — production build (also type-checks)
- `npm run lint` — ESLint

Always run `npm run build` and `npm run lint` after changes; both must pass.

## Next.js 16 specifics (important)

- Middleware is a **`proxy.ts`** file exporting `clerkMiddleware()` as default
  (Next 16 renamed `middleware` → `proxy`).
- Routes that read dynamic data during render (`searchParams`, `params`,
  `Date.now()`, Clerk auth hooks) must either set `export const instant = false`
  on the server page or be wrapped in `<Suspense>`. Route-segment config
  exports are **not allowed in `"use client"` files** — split into a thin
  server page + client component.
- `ClerkProvider` goes inside `<body>`.

## Conventions

- Use existing Tailwind design tokens, not raw colors.
- Avoid `setState` synchronously in an effect (the lint rule rejects it);
  localStorage hydration effects use a scoped eslint-disable.
- Keep secrets out of git: `.env.local` (Clerk keys) and `scripts/catalog.env`
  (BU catalog DB password) are gitignored. Never commit them.
