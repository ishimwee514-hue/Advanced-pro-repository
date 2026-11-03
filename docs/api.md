# API contract

The backend serves JSON under `/api`.

| Method | Path | Behavior |
| --- | --- | --- |
| GET | `/api/health` | API process health; does not claim the database is connected. |
| GET | `/api/ready` | Checks PostgreSQL connectivity. |
| POST | `/api/auth/register` | Creates a passenger account and returns a bearer token. |
| POST | `/api/auth/login` | Verifies passenger credentials and returns a bearer token. |
| GET | `/api/trips?origin=Kigali&destination=Huye&date=YYYY-MM-DD` | Searches scheduled/boarding trips. Date is optional and must use `YYYY-MM-DD`. |
| GET | `/api/trips/:tripId/seats` | Returns vehicle seat numbers and current availability. |
| POST | `/api/trips/:tripId/tickets` | Requires passenger bearer token and JSON `{ "seatNumber": "12" }`; creates a pending reservation using the server fare. |
| POST | `/api/trips/:tripId/tickets/:ticketId/cancel` | Requires the owning passenger token; cancels a pending reservation and releases its seat. |
| GET | `/api/trips/my-tickets` | Returns the signed-in passenger's ticket history, including reservation expiry. |
| POST | `/api/payments` | Returns `501` until a payment provider is configured and verified. |
| GET | `/api/agency/dashboard` | Returns `501` until agency reporting is implemented. |

## Reservation lifecycle

- A new reservation has status `PENDING` and expires 15 minutes after creation.
- Pending reservations whose expiry has passed are marked `CANCELLED` when trip search, seat availability, booking, or the passenger's ticket history is accessed.
- Pending reservations can be cancelled by their owning passenger.
- Cancelled tickets remain in history, but no longer block the seat.
- PostgreSQL enforces uniqueness for `(tripId, seatNumber)` while ticket status is `PENDING` or `CONFIRMED`. This is implemented by a partial unique index in the SQL migration.
- Concurrent attempts to reserve the same active seat return `409`.

A pending reservation is not a paid or confirmed ticket. Payment confirmation, automatic expiry scheduling, refunds and confirmed-ticket cancellation policies are not implemented.

## Security and configuration

Set `AUTH_TOKEN_SECRET` to a private random secret of at least 32 characters. Keep it out of source control. Passwords use salted scrypt hashes and passenger tokens expire after seven days. Configure PostgreSQL `DATABASE_URL` before using trip and ticket endpoints.

The API does not trust fare or passenger ID values supplied by the browser. Unknown API paths return `404`.
