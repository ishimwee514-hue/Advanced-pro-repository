# Ruta API

The API is a Node.js/Express service backed by PostgreSQL and Prisma.

## Passenger booking
- `GET /api/trips?origin=Kigali&destination=Huye&date=YYYY-MM-DD` — search scheduled trips.
- `GET /api/trips/:tripId/seats` — view seat availability.
- `POST /api/auth/register` and `POST /api/auth/login` — passenger registration and sign-in.
- `POST /api/trips/:tripId/tickets` — reserve a seat for 15 minutes.
- `GET /api/trips/my-tickets` — authenticated passenger booking history.
- `POST /api/trips/:tripId/tickets/:ticketId/cancel` — cancel a pending reservation.

## Live bus location
Driver location publishing requires a signed-in DRIVER account assigned to the vehicle for the trip. An ADMIN account can publish for operational testing.
- `POST /api/driver/trips/:tripId/location` — publish the current vehicle location.
  JSON body: `{ "latitude": -2.60, "longitude": 29.74, "accuracyMeters": 12, "speedKph": 35, "headingDegrees": 90 }`.
- `GET /api/trips/:tripId/location` — passengers with a pending or confirmed reservation for that trip can view its latest location.

The API stores one latest location per vehicle. Passenger responses include `isStale`; a location older than five minutes is marked stale. The driver app must request operating-system location permission and publish updates while the trip is active. The server does not fabricate locations.

## Health
- `GET /api/health` — process health.
- `GET /api/ready` — database readiness.

## Important deployment requirements
- Run `npm run db:generate` and `npm run db:migrate:deploy` after deployment.
- Set `DATABASE_URL` and a private `AUTH_TOKEN_SECRET` (at least 32 characters).
- Provision DRIVER and ADMIN accounts through a trusted administrative process. Public registration only creates PASSENGER accounts.
- Payment endpoints remain disabled until provider credentials, callback verification, reconciliation, and refund handling are implemented and tested with MTN MoMo/Airtel Money. A pending reservation is not a paid ticket.
