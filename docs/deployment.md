# Ruta deployment guide

Ruta is one repository with three clients (browser, Android, iOS), one Express API, and one PostgreSQL database. All clients should use the same deployed API and database.

## Before deployment
1. Merge the reviewed changes only after GitHub Actions checks and a manual booking flow succeed.
2. Create PostgreSQL with a provider whose current free tier fits your testing. Confirm quotas, expiry, sleeping, and backup terms.
3. Set `DATABASE_URL` and a random `AUTH_TOKEN_SECRET` (at least 32 characters) in the API host's secret settings.
4. Run database migrations and seed demo trips. Demo fares and times are sample data, not operator-confirmed schedules.
5. Set `WEB_ORIGIN` to the exact deployed website origin. Multiple comma-separated origins are supported.

## Browser website (Vercel)
1. Import this GitHub repository into Vercel and keep the project root at the repository root so npm workspaces use the root lockfile.
2. `vercel.json` sets install command `npm ci`, build command `npm run build`, and output directory `frontend/dist`.
3. Add `VITE_API_URL` with the deployed API base URL ending in `/api`, such as `https://YOUR-API-HOST/api`. Never put secrets in Vite variables.
4. Redeploy after setting the variable.

## Express API (Render or another Node host)
Configure a Node web service from the repository:
- Build command: `npm ci && npm run db:generate`
- Start command: `npm run start:backend`
- Health check path: `/api/health`
- Environment: `PORT` (usually provided by host), `DATABASE_URL`, `AUTH_TOKEN_SECRET`, `WEB_ORIGIN`.

After connecting the database, run in a trusted deployment shell or one-off job:
```sh
npm run db:migrate:deploy
npm run db:seed
```
Use the database provider's direct connection URL for migrations if it distinguishes direct and pooled URLs. Do not run development migrations against production.

## Android and iOS
1. Set `EXPO_PUBLIC_API_URL` to the same deployed API URL ending in `/api`.
2. In `apps/mobile`, run `npm install` then `npx expo start` for preview.
3. Use Expo Application Services (EAS) or native tooling for signed release builds. Android needs signing configuration; iOS distribution needs Apple signing and an Apple Developer account.
4. Test registration, login, trip search, seat refresh, duplicate-seat conflicts, and ticket history on physical devices before release.

## Known release limits
- Real payment providers are not integrated; payment requests intentionally return a not-configured response. Never mark tickets paid without verified provider confirmation.
- Seeded trips are demo data; replace with verified operator schedules before accepting passengers.
- SMS/push notifications, a complete operator/admin management API, cancellation/refund workflows, persistent mobile sessions, rate limiting, monitoring, backups, and full end-to-end tests remain release work.
- Free hosting is suitable for a demo, not a guarantee of production-grade uptime. Confirm current provider limits and terms.
