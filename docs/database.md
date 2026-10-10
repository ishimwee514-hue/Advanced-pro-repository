# Database starter

`backend/prisma/schema.prisma` defines the initial PostgreSQL domain models: users, vehicles, routes, trips, tickets and payments. Prisma is the source of truth for database models; schema evolution should use migrations rather than handwritten model classes.

Set `DATABASE_URL` in `backend/.env`, then run:

```sh
npm run db:generate
npm run db:migrate
```

The schema is an initial foundation, not a final production data model. Review ownership, agency tenancy, audit history, payment idempotency, refund rules and retention requirements before deploying or processing real transactions.
