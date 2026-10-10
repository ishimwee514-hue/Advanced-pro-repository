# Ruta Smart Mobility

Ruta is a React + Vite starter for a transport operations and passenger platform. This first iteration establishes the frontend structure and navigable system pages; it does not include an API, authentication, database or live payment integration.

## Getting started

```sh
npm install
npm run dev
```

Use the **View as** selector in the top bar to explore agency, driver and passenger dashboard views. The sign-in screen is a demo entry point only; no credentials or personal data are stored.

## Frontend structure

```text
src/
├── components/       # Shared layout, navigation, tables and UI building blocks
├── context/          # Shared frontend state, including the demo role
├── data/             # Clearly labelled sample records used by the starter screens
├── pages/             # Dashboard, trips, routes, fleet, tickets, payments and sign-in
├── utils/             # Small shared formatting and display helpers
├── App.jsx            # Client-side routes
├── App.css            # Application styles and responsive layouts
├── index.css          # Global document styles
└── main.jsx           # React entry point
```

## Starter pages

- **Overview:** role-aware summary, trip list and network status.
- **Trips, Routes, Fleet:** initial transport operations screens.
- **Tickets and Payments:** sample records and explicit notices where integrations are not connected.
- **Sign in:** demo role selection; not real authentication.

All displayed operational data is static sample content. The next implementation phase can add API services, a backend, PostgreSQL/Prisma schema, authentication, validation and payment-provider integrations without presenting these mock screens as live data.
