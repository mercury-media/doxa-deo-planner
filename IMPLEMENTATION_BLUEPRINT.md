# Church Operations Platform Implementation Blueprint

This blueprint turns your architecture (Vercel + Render + Supabase) into a practical, maintainable plan that a mid-level developer can edit safely.

---

## 1) Target Architecture (Simple + Scalable)

- **Frontend (Vercel):** Angular 20 PWA + **Tailwind CSS** + **PrimeNG**.
- **Backend (Render):** Node.js + Express REST API.
- **Database (Supabase):** PostgreSQL (and Storage for files).
- **Auth:** JWT access tokens with **15-day expiry**, role-aware authorization.
- **Notifications:** Web Push API (service worker + VAPID keys).
- **Phase 2+ (optional):** Upstash Redis + BullMQ queue for background jobs.

### Guiding principles

1. Keep each module small and isolated.
2. Prefer explicit code over “magic” abstractions.
3. Keep naming predictable across FE/BE/DB.
4. Add complexity only when needed.

---

## 2) Monorepo Layout (Easy to Navigate)

```txt
/apps
  /web                  # Angular 20 app (PWA)
  /api                  # Express API
/packages
  /shared-types         # TS types shared by FE + BE
/docs
  /adr                  # architecture decisions (short markdown notes)
```

If you prefer separate repos, keep the same folder conventions in each repo.

---

## 3) Database Blueprint (Supabase/Postgres)

Use a **church_id** on all tenant-owned tables.

### Core tables

- `churches`
- `users`
- `memberships` (user ↔ church with role)
- `services`
- `service_items`
- `teams`
- `team_roles`
- `schedules`
- `songs`
- `song_files` (storage references)
- `push_subscriptions`

### Minimal role model

- `owner`
- `admin`
- `leader`
- `member`

### Multi-tenant rules

- Every query must include `church_id` filters.
- Foreign keys should enforce tenant consistency where possible.
- Add indexes:
  - `(church_id, created_at desc)` on list-heavy tables.
  - `(church_id, date)` for services/schedules.

---

## 4) Backend Blueprint (Render, Express)

### API folder structure

```txt
apps/api/src
  /config
  /modules
    /auth
    /churches
    /services
    /songs
    /schedules
    /notifications
  /middleware
  /lib
  /types
  app.ts
  server.ts
```

### Standard module pattern (repeat per domain)

- `*.route.ts` (HTTP routes)
- `*.controller.ts` (request/response mapping)
- `*.service.ts` (business logic)
- `*.repo.ts` (SQL queries)
- `*.schema.ts` (validation)

This pattern keeps things understandable and easy to edit.

### Auth and token policy

- Access token: JWT with **15-day expiration** (`exp` claim).
- Include claims: `sub` (user id), `church_id`, `role`.
- Validate token on every protected route via middleware.
- Keep token invalidation simple at first:
  - rotate signing key only for emergencies,
  - optional `token_version` in DB if forced logout is needed later.

### Security middleware

- `helmet`
- `cors` (restrict to frontend origin)
- rate limiting on auth routes
- input validation with Zod (or similar)

### API conventions

- Versioned prefix: `/api/v1`
- Use predictable response shape:
  - `{ data, meta, error }`
- Keep pagination consistent:
  - `?page=1&pageSize=20`

---

## 5) Frontend Blueprint (Angular 20 + Tailwind + PrimeNG)

### Setup choices

- Angular standalone APIs.
- Tailwind for layout/spacing/utility classes.
- PrimeNG for complex components (tables, dialogs, calendars, toasts).
- Keep styling rule simple:
  - Tailwind for composition,
  - PrimeNG for component behavior,
  - minimal custom CSS.

### FE folder structure

```txt
apps/web/src/app
  /core                # singleton services, guards, interceptors
  /shared              # shared UI pieces + pipes + utilities
  /features
    /auth
    /services
    /songs
    /schedules
    /settings
```

### State strategy (keep simple)

- Start with Angular signals + service-based state.
- Avoid introducing NgRx initially unless complexity clearly requires it.

### Auth flow in frontend

1. Login form calls `/api/v1/auth/login`.
2. Store JWT securely (prefer httpOnly cookie if BE supports it, otherwise memory + secure fallback).
3. HTTP interceptor adds bearer token.
4. Route guards enforce auth/role checks.
5. Auto-logout when token expires (15 days).

---

## 6) PWA + Offline Plan

Use Angular service worker with conservative caching first.

### Cache strategy

- App shell: pre-cache.
- Service plans + songs list: stale-while-revalidate.
- Song files: cache-first with size limits.

### Offline behavior

- Read access available for cached services/songs.
- Show “offline mode” banner.
- Queue write actions (optional phase 2).

Keep first release read-optimized offline to reduce sync complexity.

---

## 7) Web Push Notifications (No Third-Party Dependency)

### Data model

- Store subscriptions in `push_subscriptions` by `user_id`, `church_id`, endpoint hash.

### Flow

1. FE asks for notification permission.
2. FE registers service worker and sends subscription to API.
3. API stores/upserts subscription.
4. On events (new schedule assignment, service update), API sends push message.
5. Remove expired subscriptions on push failure response.

### Event examples

- “You were added to Sunday Worship Team (Apr 28).”
- “Service plan updated for 9:00 AM.”

---

## 8) Environment Variables

### Frontend (Vercel)

- `API_BASE_URL`
- `VAPID_PUBLIC_KEY`

### Backend (Render)

- `PORT`
- `NODE_ENV`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=15d`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`

Never expose private keys in the frontend.

---

## 9) MVP Delivery Phases

### Phase 1 (MVP)

- Auth (15-day JWT)
- Churches + memberships
- Services + service items
- Songs library
- Basic scheduling
- PWA install + offline read for plans/songs

### Phase 2

- Web push notifications
- File uploads (song sheets/audio)
- Better filters/search

### Phase 3

- Redis + BullMQ for async jobs
- Email workflows (Zoho)
- Reporting dashboards

---

## 10) Developer Workflow (Maintainable for Mid-Level Devs)

- Keep each PR under ~300 lines when possible.
- Add one short ADR note for non-obvious architecture decisions.
- Add request/response examples near each API module.
- Include basic tests for service logic and middleware.
- Prefer explicit SQL queries over heavy ORMs initially.

### Recommended coding standards

- strict TypeScript enabled
- ESLint + Prettier
- shared DTO types in `/packages/shared-types`
- no circular imports

---

## 11) Starter API Endpoints

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/services`
- `POST /api/v1/services`
- `GET /api/v1/songs`
- `POST /api/v1/songs`
- `GET /api/v1/schedules`
- `POST /api/v1/schedules`
- `POST /api/v1/notifications/subscribe`

All protected endpoints require token + `church_id` scope checks.

---

## 12) What to Build First (Exact Order)

1. Create Supabase schema + seed one church and one owner.
2. Build auth module with 15-day JWT and `/auth/me`.
3. Build services module end-to-end (DB → API → UI).
4. Add songs module.
5. Add schedules module.
6. Add service worker caching for read-only offline.
7. Add push subscription registration.

This order gives fast visible progress while keeping complexity manageable.
