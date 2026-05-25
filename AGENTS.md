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
- No test, lint, or typecheck scripts are configured

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
- API client at `src/lib/api.ts` calls `VITE_API_URL` (default `http://localhost:4010`)
- Layout at `src/components/Layout.tsx` with sidebar nav
