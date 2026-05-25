# Calendar Booking API — TypeSpec

## Quick start

```bash
npm install
npx tsp compile main.tsp
```

Output: `tsp-output/schema/openapi.yaml`

## Project structure

- `main.tsp` — sole entrypoint, defines the Calendar Booking API
- `tspconfig.yaml` — configures `@typespec/openapi3` emitter (OpenAPI 3.1.0)
- `package.json` — private, no custom scripts; all work via `npx tsp`

## Key facts

- Only edit `main.tsp` and `tspconfig.yaml`; never edit `tsp-output/` (generated) or `.github/workflows/hexlet-check.yml` (Hexlet CI — do not delete/edit/rename)
- API version is managed in `package.json` (`"version": "0.1.0"`) — the OpenAPI output gets `0.0.0` from the compiler default
- The `packageManager` field pins npm 11.15.0 — use `npm install` (not `yarn`/`pnpm`)
- Test script: `npm run test:e2e` — runs Playwright in `e2e/`
- CI pipeline (`.github/workflows/deploy.yml`): compiles TypeSpec, typechecks backend, starts servers, runs e2e tests, builds Docker image → pushes to GHCR (no Render deployment)

## Frontend (`frontend/`)

```bash
cd frontend
npm run dev       # Vite dev server (default http://localhost:5173)
npm run mock      # Prism mock server on port 4010 from tsp-output/schema/openapi.yaml
npm run build     # tsc -b && vite build — production output to dist/
```

- React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 + shadcn/ui (Radix Nova preset)
- Types auto-generated from OpenAPI spec: `npm run gen-types` (runs `openapi-typescript`)
- Pages at `src/pages/`: `EventTypesPage`, `BookingsPage`, `AvailabilityPage`
- API client at `src/lib/api.ts` calls `VITE_API_URL` (default `http://localhost:3001`)
- Layout at `src/components/Layout.tsx` with sidebar nav
- `.env` file sets `VITE_API_URL=http://localhost:3001` (real backend)

## Backend (`backend/`)

```bash
cd backend
./dev.sh          # start the server (port 3001)
```

### Manual run (after compile)

```bash
cd backend
export PATH="/tmp/node-v22.14.0-linux-x64/bin:$PATH"   # WSL Node.js
node dist/main.js
```

- Express 5 + TypeScript 6, in-memory storage
- `src/main.ts` — entry point, routing, CORS
- `src/handlers.ts` — request handlers for all 9 endpoints
- `src/store.ts` — in-memory store (Map-based)
- `src/availability.ts` — slot generation (09:00–17:00 UTC, step = durationMinutes), overlap detection
- `src/models.ts` — TypeScript interfaces matching OpenAPI spec
- Conflict detection returns **409** on overlapping bookings
- 14-day window enforced on availability queries
- No DB — data resets on restart
- Compile: `node ./node_modules/typescript/bin/tsc` (outputs to `dist/`)
