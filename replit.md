# مشوار (Mashwar)

A freight & moving truck booking platform — Arabic RTL landing page + API server.

## Stack

- **Frontend** (`artifacts/mashwar`): React + Vite + Tailwind CSS v4, RTL Arabic UI, Wouter routing
- **API Server** (`artifacts/api-server`): Express 5, Drizzle ORM, Pino logging
- **Shared libs** (`lib/`): `api-spec`, `api-zod`, `api-client-react`, `db`
- **Package manager**: pnpm workspaces

## Running the project

| Service | Workflow | Command |
|---|---|---|
| Frontend | `artifacts/mashwar: web` | `pnpm --filter @workspace/mashwar run dev` |
| API Server | `artifacts/api-server: API Server` | `pnpm --filter @workspace/api-server run dev` |

## Environment variables

| Variable | Required by | Notes |
|---|---|---|
| `PORT` | Both services | Auto-assigned by Replit per artifact |
| `BASE_PATH` | Frontend | Auto-assigned by Replit (e.g. `/`) — required by vite.config.ts |
| `DATABASE_URL` | API Server (DB routes) | PostgreSQL connection string — server starts without it, but DB-backed routes will fail |
| `VITE_SUPABASE_URL` | Frontend (contact form) | Supabase project URL — required for contact form submission |
| `VITE_SUPABASE_ANON_KEY` | Frontend (contact form) | Supabase anonymous/public key — required for contact form submission |
| `SESSION_SECRET` | API Server (future) | Available as a secret; not yet wired into middleware |

The **frontend landing page works without the API server** — it is a fully static marketing site.
The **API server starts and serves `/api/healthz` without `DATABASE_URL`**; DB-backed routes need it.
The **contact form** requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — the app throws at startup if these are missing (see Task #3).

## User preferences
