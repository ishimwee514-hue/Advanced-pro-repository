# API starter contract

The backend serves JSON under `/api`.

| Method | Path | Current behavior |
| --- | --- | --- |
| GET | `/api/health` | Returns the API process health status. Does not claim the database is connected. |
| POST | `/api/auth/login` | Returns `501` until authentication is implemented. |
| GET | `/api/trips` | Returns `501` until trip persistence and validation are implemented. |
| POST | `/api/payments` | Returns `501` until a payment provider is configured and verified. |
| GET | `/api/agency/dashboard` | Returns `501` until agency reporting is implemented. |

Unknown API paths return `404`. The starter does not accept or store credentials, book trips, or initiate payments.
