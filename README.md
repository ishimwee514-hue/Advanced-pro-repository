# Ruta Smart Mobility

Ruta is an npm-workspaces monorepo for a transport operations and passenger platform. The frontend contains the current navigable demo screens. The backend is a runnable Express starter with a Prisma/PostgreSQL schema and an API health endpoint.

## Getting started

```sh
npm install
npm run dev
```

Run the API in a second terminal with `npm run dev:backend`. The frontend is served at `http://localhost:3000`; the API listens at `http://localhost:4000`.

Use the **View as** selector in the top bar to explore agency, driver and passenger dashboard views. The sign-in screen is a demo entry point only; no credentials or personal data are stored. API domain endpoints intentionally return `501 Not Implemented` until their business logic, authentication and validation are implemented. Payments and SMS are not connected.

## Monorepo structure

```text
frontend/
├── public/            # Static favicon and public assets
├── src/
│   ├── components/    # Shared navigation, role selector, tables and UI
│   ├── context/       # Frontend role state
│   ├── data/          # Sample data for the demo screens
│   ├── pages/         # Shared pages and Agency, Driver, Passenger views
│   ├── services/      # API client and auth, trip, payment request modules
│   ├── styles/        # Application and document styles
│   └── utils/         # Shared display helpers
├── index.html         # Vite HTML entry (kept at Vite's expected root)
└── vite.config.js
backend/
├── prisma/schema.prisma
└── src/
    ├── config/        # Environment, database and payment configuration
    ├── controllers/   # API request handlers
    ├── middleware/    # Error and not-found handlers
    ├── routes/        # Versionable API route modules
    ├── services/      # External service integration boundaries
    └── utils/         # Shared HTTP error helpers
docs/                  # Architecture, API and database notes
```

Vite expects its HTML entry at `frontend/index.html` rather than `frontend/public/index.html`; files in `frontend/public/` are copied to the site root as static assets. Prisma's schema is the source of truth for database models.

For local PostgreSQL work, copy `backend/.env.example` to `backend/.env`, configure `DATABASE_URL`, then run `npm run db:generate` and `npm run db:migrate`.

All displayed operational data is static sample content. See [docs/architecture.md](docs/architecture.md), [docs/api.md](docs/api.md) and [docs/database.md](docs/database.md) for current boundaries and next steps.
