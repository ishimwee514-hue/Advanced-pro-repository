# API contract

The backend serves JSON under `/api`.

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/health` | Returns API process health; does not claim the database is connected. |
| POST | `/api/auth/register` | Creates a passenger account and returns a bearer token. Requires `AUTH_TOKEN_SECRET` (at least 32 characters). |
| POST | `/api/auth/login` | Verifies passenger email and password and returns a bearer token. |
| GET | `/api/trips?origin=Kigali&destination=Huye&date=YYYY-MM-DD` | Searches scheduled or boarding trips; date is optional and must use `YYYY-MM-DD`. Results are capped at 100. |
| GET | `/api/trips/:tripId/seats` | Returns vehicle seat numbers and current availability. |
| POST | `/api/trips/:tripId/tickets` | Requires passenger bearer token and JSON `{ "seatNumber": "12" }`; creates a pending ticket using the server fare. |
| GET | `/api/trips/my-tickets` | Requires passenger bearer token and returns the signed-in passenger's tickets. |
| POST | `/api/payments` | Returns `501` until a payment provider is configured and verified. |
| GET | `/api/agency/dashboard` | Returns `501` until agency reporting is implemented. |

Booking is protected by the database's unique `[tripId, seatNumber]` constraint; concurrent attempts for the same seat return `409`. Pending and confirmed tickets count as reserved. Creating a ticket does not collect payment or mark it confirmed. The API does not trust fare or passenger ID values supplied by the browser.

Set `AUTH_TOKEN_SECRET` to a private random secret of at least 32 characters in the backend environment. Keep it out of source control. Passwords are stored as salted scrypt hashes. Tokens expire after seven days. Configure a PostgreSQL `DATABASE_URL` before using trip and ticket endpoints.

Unknown API paths return `404`.
