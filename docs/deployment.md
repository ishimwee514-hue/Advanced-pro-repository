# Ruta deployment guide

Ruta is one repository with three clients (browser, Android, iOS), one Express API, and one PostgreSQL database. All clients use the same deployed API and database.

## Before deployment

1. Merge reviewed changes only after GitHub Actions checks and manual booking-flow testing.
2. Create PostgreSQL with a provider whose current plan fits the intended testing or production workload. Confirm quotas, backups, availability and connection limits.
3. Set `DATABASE_URL` and a random `AUTH_TOKEN_SECRET` (at least 32 characters) in the API host's secret settings.
4. Run database migrations. Seed demo trips only in development or clearly labelled demo environments.
5. Replace demo schedules with verified operator schedules before accepting real passengers.
6. Set `WEB_ORIGIN` to the exact deployed website origin.

## Browser website (Vercel)

1. Import this GitHub repository into Vercel and keep the project root at the repository root so npm workspaces use the root lockfile.
2. The Vercel configuration uses `npm ci`, `npm run build`, and `frontend/dist`.
3. Add `VITE_API_URL` with the deployed API base URL ending in `/api`.
4. Never put secrets in Vite variables.

## Express API (Render or another Node host)

Configure a Node web service:
- Build: `npm ci && npm run db:generate`
- Start: `npm run start:backend`
- Health check: `/api/health`
- Readiness check: `/api/ready`
- Environment: `PORT`, `DATABASE_URL`, `AUTH_TOKEN_SECRET`, `WEB_ORIGIN`.

Run `npm run db:migrate:deploy` in a trusted deployment shell or one-off job. Use a direct database URL for migrations if the provider distinguishes pooled and direct connections. Do not run development migrations against production.

## Android and iOS

1. Set `EXPO_PUBLIC_API_URL` to the same deployed API URL ending in `/api`.
2. In `apps/mobile`, install dependencies and run `npx expo start` for preview.
3. Use Expo Application Services or native tooling for signed release builds.
4. Test registration, login, trip search, seat refresh, duplicate-seat conflicts, reservation expiry/cancellation and ticket history on physical devices.
5. Android requires signing configuration; iOS distribution requires Apple signing and an Apple Developer account.

## Release limitations

- Payments are not integrated. Payment requests intentionally return a not-configured response. Never mark tickets paid without verified provider confirmation.
- Seeded trips are demo data, not operator-confirmed schedules.
- Complete operator/driver management, payment reconciliation, refunds, SMS/push notifications, persistent mobile sessions, rate limiting, production monitoring, backups and full device/end-to-end QA remain release work.
- Expired pending reservations are currently released lazily when relevant API endpoints are accessed; a scheduled cleanup worker is not yet configured.
- Free hosting is suitable for demos, not a guarantee of production-grade uptime.
