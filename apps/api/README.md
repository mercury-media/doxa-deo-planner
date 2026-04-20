# API (Render / Express)

## Quick start

1. Copy env file:

```bash
cp .env.example .env
```

2. Create database schema in Postgres:

```bash
psql "$DATABASE_URL" -f src/db/schema.sql
```

3. Install + run:

```bash
npm install
npm run dev
```

## Endpoints

- `POST /api/v1/auth/register-church`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/churches/mine`
- `GET|POST /api/v1/services`
- `GET|POST /api/v1/songs`
- `GET|POST /api/v1/schedules`
- `POST /api/v1/notifications/subscribe`
- `POST /api/v1/notifications/notify-self`

## Auth

- Access token JWT expiry defaults to `15d` (`JWT_EXPIRES_IN`).
- Claims include `sub`, `church_id`, `role`, and `email`.
- Role checks are applied on mutating routes.
