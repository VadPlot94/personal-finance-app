# instant-nav rig: personal-finance-app

- BUILD: `npm run build:instant-nav` then `npx next start -p 4173` (Playwright `webServer` starts this). Port 4173 so a local `next dev` on 3000 is left alone. Stop any previous process on 4173 before a run (`EADDRINUSE` is a failed run, not evidence about prefetching).
- EXPOSE: `experimental.exposeTestingApiInProductionBuild` is true only when `npm_lifecycle_event` is `build:instant-nav`. Regular `npm run build` / Vercel does not expose the API.
- RUN: `npm run test:instant-nav` with `BASE_URL=http://localhost:4173` (Playwright default). Import `instant()` from `@next/playwright`.
- TEST USER: credentials login via `AUTH_EMAIL` / `AUTH_PASSWORD` from `.env.local` (admin bootstrap pair). Public tests use an empty storage state. Locale: `en-US`. Seeded demo finance data after first admin login.
- DRIFT: none known if the admin pair is set and demo data was seeded; empty or missing credentials make authenticated destinations unreachable.
- CONTRACTS: viewport `prefetch={true}` on links to `/login`, `/overview`, `/transactions`, `/budgets`, `/pots`, `/recurring`. Prefetched UI: destination chrome (login form fields, or page header / primary action). Navigation-only: none selected (session-cached page bodies may still stream). Trigger: viewport, no hover.
- LOOP: local `npm run build:instant-nav` → Playwright `webServer` `next start -p 4173` → `npm run test:instant-nav` → stop server → edit → repeat. Agent limits: needs `.env.local` auth pair; must not kill an existing `next dev` on 3000.
- LIVENESS: n/a; local build and start
- WALLS: Windows PowerShell has no `ENV=1 cmd` prefix — the build script name gates the testing API. Chromium must be installed (`npx playwright install chromium`).
