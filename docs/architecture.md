# Ruta architecture

Ruta is an npm-workspaces monorepo with three clients sharing one Express API and PostgreSQL database.

```text
frontend/       React + Vite browser application
apps/mobile/    Expo + React Native application for Android and iOS
backend/        Express API, authentication, domain controllers and services
backend/prisma/ PostgreSQL schema, migrations and demo seed
docs/           Architecture, API, database and deployment guides
```

## Implemented passenger capabilities

- Passenger registration and sign-in with signed bearer tokens.
- Trip search by origin, destination and travel date.
- Current seat availability from PostgreSQL.
- Server-calculated fares and passenger-owned ticket history.
- Pending seat reservations with a 15-minute expiry.
- Passenger cancellation of pending reservations.
- Database-enforced uniqueness for seats held by pending or confirmed tickets.
- Expired reservations are released when booking/search endpoints are accessed.

The PostgreSQL migration uses a partial unique index for active ticket statuses. Prisma does not represent that partial-index predicate directly; keep the SQL migration and model changes aligned when evolving the ticket schema.

## Infrastructure foundation

- Request correlation IDs and baseline HTTP security headers.
- Structured JSON logging.
- API health and database readiness endpoints.
- Adapter contracts for cache, private storage and durable jobs.

These foundations do not mean that a production cache, object-storage provider, worker system or external monitoring service is configured.

## Development

Requirements: Node.js 20.6+ and PostgreSQL.

```sh
npm ci
cp backend/.env.example backend/.env
# Set DATABASE_URL and AUTH_TOKEN_SECRET (private random value, 32+ chars)
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

In a second terminal run `npm run dev:backend`. The browser client uses `http://localhost:3000`; the API uses `http://localhost:4000/api`.

## Validation

Run `npm run test:backend` with a migrated PostgreSQL database, then `npm run build`. GitHub Actions runs the backend booking integration test against a temporary PostgreSQL service and bundles the Android client.
