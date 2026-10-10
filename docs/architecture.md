# Ruta architecture

Ruta is an npm-workspaces monorepo. The frontend and backend are separate applications with independent package manifests and a shared root command interface.

```text
frontend/  React + Vite client, pages, reusable components, API services and styles
backend/   Express API, configuration, middleware, domain controllers and routes
backend/prisma/ PostgreSQL schema and generated Prisma client
docs/      Architecture, API starter contract and database notes
```

The Vite HTML entry lives at `frontend/index.html` (Vite's standard convention); static files such as icons belong in `frontend/public/`. The current screens continue to use clearly marked sample data. The Express API currently provides a health endpoint; domain endpoints return `501 Not Implemented` until their behavior, authentication and validation are implemented. Payment credentials are never stored in source control.

## Development

Run the client and API in separate terminals:

```sh
npm install
npm run dev
npm run dev:backend
```

The client uses `http://localhost:3000`, and the API uses `http://localhost:4000` by default. Copy `backend/.env.example` to `backend/.env` for local backend configuration. Set `DATABASE_URL` to a local PostgreSQL database before generating the Prisma client or running migrations.
