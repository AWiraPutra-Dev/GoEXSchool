# AGENTS.md

## Project Overview

**StudentBase** (eskulhub-prototype) is a school extracurricular management platform built with **Nuxt 4.5** (SPA mode, SSR disabled) and **PostgreSQL** via Prisma ORM. It serves three user roles: admin (school-wide), operator (per-extracurricular), and student. The app is written primarily in Indonesian (Bahasa Indonesia) — UI labels, comments, error messages, and seed data are all in Indonesian.

## Essential Commands

```bash
npm run dev          # Start dev server on http://0.0.0.0:4321
npm run build        # Production build
npm run preview      # Preview production build
npx prisma migrate dev --name <name>   # Create & apply migration
npx prisma db seed                     # Seed database (uses tsx)
npx prisma generate                    # Regenerate Prisma client after schema changes
```

There are **no test scripts, lint scripts, or CI configs** in this project. No test framework is configured.

## Environment Setup

Copy `.env.example` to `.env`. Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — signing key for JWT tokens (has a hardcoded fallback, but set it in production)

The `postinstall` script runs `nuxt prepare` then applies a **Pinia patch** (`scripts/patch-pinia.ps1`) that fixes `hasOwnProperty` calls in Pinia's bundled source. This is a PowerShell script — it only works on Windows. If postinstall fails on non-Windows, manually apply the patch or skip it (the app may still work).

## Architecture

### SPA-Only (No SSR)

`ssr: false` in `nuxt.config.ts`. All data fetching happens client-side. Auth state lives in `localStorage` + cookies. There is no server-side rendering, so hydration mismatches are not a concern.

### Source Directory Layout

`srcDir: 'app'` — all frontend code lives under `app/`, not the project root. Server API routes live under `server/`.

```
app/
  pages/           # File-based routing: /admin/*, /operator/*, /siswa/*
  components/      # Shared Vue components
  composables/     # useConfirm, useEkskulScope, usePagination
  stores/          # Pinia stores: auth, master-data, operator-data, siswa-data, ui
  plugins/         # api.ts (global $fetch override), pinia, theme, data-sync
  i18n/            # Lightweight custom i18n (NOT @nuxtjs/i18n)
  utils/           # permissions catalog, cache TTL, theme helpers
  layouts/         # dashboard.vue (TopBar + Sidebar + main content)
  middleware/       # Client-side auth guard with role-based redirects
server/
  api/             # Nitro file-based API routes organized by role prefix
  middleware/       # Server-side auth + permission enforcement
  utils/           # prisma singleton, jwt, permissions, scope, notifications
prisma/
  schema.prisma    # Database schema
  seed.ts          # Seed data with default accounts
```

### Authentication Flow

1. Login via `POST /api/auth/login` → returns JWT token + user + institution
2. Token stored in `localStorage` (`eh_token`) AND cookie (`eh_token`, 7-day expiry)
3. `app/plugins/api.ts` overrides global `$fetch` to inject `Authorization: Bearer` header on all same-origin requests
4. Server middleware (`server/middleware/auth.ts`) accepts token from header OR cookie
5. On 401 response, the plugin clears storage and redirects to `/login`
6. Client middleware (`app/middleware/auth.ts`) enforces role-based route prefixes:
   - `admin` → `/admin/*`
   - `operator` → `/operator/*`
   - `student` → `/siswa/*`

### Permission System

Granular CRUD permissions per feature, defined as a single source of truth in `app/utils/permissions.ts` (`PERMISSION_FEATURES` array). Format: `feature:action` (e.g., `gallery:create`).

- Admin/super_admin bypass permission checks
- Operator and privileged students are checked against their assigned permissions
- HTTP method maps to action: GET→read, POST→create, PUT/PATCH→update, DELETE→delete
- Route-to-feature mapping is in `server/utils/permissions.ts` (`ROUTE_FEATURES`)
- When adding a new API route under `/api/admin/` or `/api/operator/`, add its prefix to `ROUTE_FEATURES` or it will be blocked with 403

### Operator Scoping

Operators are bound to exactly one extracurricular activity (`User.extracurricularId`). Server utilities in `server/utils/scope.ts` enforce this:
- `getOperatorScope(event)` — determines if the current user is scoped
- `assertScope(scope, ekskulId)` — rejects writes to other extracurriculars
- `scopeFilter(scope, queryEkskulId)` — builds Prisma where clause for reads

Always use these utilities in operator-facing API routes. Never trust client-provided `extracurricularId` for operators.

### Data Caching Strategy

Pinia stores use a TTL-based freshness check (`app/utils/cache.ts`, 30-second TTL). Stores like `master-data` deduplicate concurrent fetches and skip re-fetching if data is fresh. Institution data syncs every 30 seconds via `auth.refreshInstitution()`.

### i18n (Custom, Lightweight)

Not using `@nuxtjs/i18n`. Custom implementation in `app/i18n/`:
- Dictionary files per locale: `id.ts`, `en.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`
- Indonesian (`id`) is bundled; others are lazy-loaded
- Supports RTL for Arabic
- Translation keys are flat strings in `Dict = Record<string, string>`

## Key Gotchas

### Dynamic Route Bug Workaround
Nuxt 4.5 / vue-router 5.2.0 generates dynamic params as `:param()` (with empty parens), breaking routes like `/siswa/blog/[slug]`. A `pages:extend` hook in `nuxt.config.ts` strips the trailing `()`. Do not remove this hook.

### xlsx Externalization
The `xlsx` library is externalized in Nitro config (both `externals.external` and `rollupConfig.external`). It cannot be bundled into the server build. If you add server-side Excel processing, be aware of this constraint.

### bcrypt-ts Module Side Effects
`bcrypt-ts` is listed in `nitro.moduleSideEffects` because it requires special handling during bundling. Password hashing uses `bcrypt-ts` (not `bcrypt`).

### Icon Bundling
Icons (`i-lucide-*`) are bundled at build time via `@nuxt/icon` client bundle scanning. New icons used in templates are auto-detected. Fallback goes to `/api/_nuxt_icon` for icons missed during scan.

### Upload Handling
File uploads go to `public/uploads/` with UUID filenames. Max 5MB, images only (JPEG/PNG/GIF/WebP). Multiple upload endpoints exist: `/api/shared/upload`, `/api/operator/upload`. The shared endpoint is accessible to any authenticated user.

### Notification Sync
Notifications are generated programmatically via `server/utils/notifications.ts` (`syncNotifications`). They are upserted by composite key `${type}:${refId}:${userId}` to prevent duplicates. Call this function when relevant data changes (new feed posts, achievements, schedules, polls).

### Seed Credentials
Default accounts from `prisma/seed.ts`:
- Admin: `admin` / `admin123`
- Operator: `operator` / `operator123`
- Student: various NIS-based accounts with password `siswa123`

## Code Conventions

- **Language**: Comments, error messages, and UI text are in Indonesian
- **API naming**: File-based Nitro routes with `[id].method.ts` pattern for dynamic params
- **Store pattern**: Pinia stores with `defineStore`, auto-imported via Nuxt config
- **Component naming**: PascalCase files (e.g., `TopBar.vue`, `ConfirmDialog.vue`)
- **CSS**: Scoped styles in SFCs, CSS variables for theming (`var(--bg-main)`, etc.)
- **Theme color**: Configurable per institution via `Institution.themeColor`, applied globally
- **No TypeScript strict mode**: `tsconfig.json` extends Nuxt defaults
