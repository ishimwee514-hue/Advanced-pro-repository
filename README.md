# Ruta Smart Mobility

Ruta is a single-repository bus mobility platform for Rwanda with three clients sharing one API and PostgreSQL database:

- **Browser website:** React + Vite, for Chrome and other modern browsers.
- **Android app:** Expo + React Native in `apps/mobile`.
- **iOS app:** Expo + React Native in `apps/mobile`.
- **Backend:** Express API + Prisma.
- **Database:** PostgreSQL.

## Current capabilities
- Passenger registration and sign-in (API)
- Search scheduled trips by origin, destination, and date
- View seat availability and select a seat
- Reserve a seat with a server-calculated fare
- View authenticated passenger ticket history
- Seed demo routes and future trips for testing

Bookings remain **PENDING** until a real payment provider is configured. No payment success is simulated. Seed data is illustrative, not verified operator schedules.

## Structure
```text
frontend/          Browser website (React/Vite)
apps/mobile/       Android + iOS client (Expo/React Native)
backend/           Express API and Prisma schema
backend/prisma/    Database schema and demo seed
.github/workflows/ Build checks
docs/              Architecture, API, database and deployment guides
vercel.json        Browser deployment configuration
```

## Run locally
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
In a second terminal run `npm run dev:backend`. Browser: `http://localhost:3000`; API health: `http://localhost:4000/api/health`.

For mobile, see [apps/mobile/README.md](apps/mobile/README.md). Set `EXPO_PUBLIC_API_URL` to an API URL reachable from the phone.

## Deploy
See [docs/deployment.md](docs/deployment.md) for browser hosting, API/database configuration, and mobile release steps.

## Release status
This is active development, not a verified production booking service. Configure a real database, migrate and seed it, pass automated checks, and manually test the full booking journey before launch. Payments, notifications, complete operator/admin management, refunds, and production operations are not complete.
