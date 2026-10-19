# Developer notes

Architecture decisions, backend map, debugging, experiments, and roadmap.  
Public overview lives in [README.md](README.md).

---

## Transactions pagination & table filters

### Current approach

Pagination and table filters on `/transactions` (and the recurring bills table) use **Server Actions**, not URL state.

Flow:

1. Client holds filter state (`page`, `sortBy`, `category`, `search`, …).
2. On change, it calls a Server Action (e.g. `getAllTransactionsSRF` / recurring analog) with those params.
3. The response updates local table state.

Initial SSR in [`src/app/(app)/transactions/page.tsx`](src/app/(app)/transactions/page.tsx) loads the first page of data. Later filter changes do **not** re-drive RSC via the URL.

Key files:

- [`src/front-end/components/transactions/transactions-table-layout.tsx`](src/front-end/components/transactions/transactions-table-layout.tsx)
- [`src/back-end/server-actions/transaction-actions.ts`](src/back-end/server-actions/transaction-actions.ts)

### Alternatives (not used for filters)

| Approach | Idea | When it fits |
|---|---|---|
| **searchParams + RSC** | Client updates the URL → `page` reads `searchParams` → controller → props | Shareable links, back/forward, deep-linking filters |
| **Route Handler** | `GET`/`POST` `/api/…` + `fetch` from the client | Public HTTP API or non-Next consumers |

### Why not searchParams

Filters should not live in the URL for this app (no `?page=&sort=&q=` as the main filter mechanism).

Exception: `?category=` is only a deep-link from Budgets (`TransactionsTile` → “See all”), not the primary table filtering path.

### Why Server Action over Route Handler here

- Data is only needed by this Next.js UI, not by external clients.
- The stack already goes `server-actions` → controllers → DAL; a parallel `/api` layer would duplicate that.
- Typed function call — no manual JSON/`fetch` contract.
- A Route Handler would make sense later if a separate public REST API is required.

### Notes

- Client → Server Action → JSON is a normal pattern for interactive tables when every filter click should not rewrite the URL.

---

## i18n (next-intl)

- Package: `next-intl` (cookie `locale`, no `/[locale]` URL prefix)
- Locales: `en-US` (default), `ru-RU` — see [`translation.service.ts`](src/shared/services/translation.service.ts)
- Messages: [`src/i18n/messages/en-US.json`](src/i18n/messages/en-US.json), [`src/i18n/messages/ru-RU.json`](src/i18n/messages/ru-RU.json) — keys under `i18n.*`
- Client: `useTranslations()` / `useLocale()`; server: `getTranslations()` / `getLocale()`
- Switcher: [`locale-switcher`](src/front-end/components/locale-switcher/locale-switcher.tsx) → [`setLocaleSRF`](src/back-end/server-actions/locale-actions.ts) (cookie + `router.refresh()`);
- `<html lang>`: root layout uses `DefaultLocale`; [`html-lang`](src/front-end/components/html-lang/html-lang.tsx) syncs from `useLocale()` after hydrate

## Backend

- `src/lib/auth.ts` — NextAuth configuration
- `src/back-end/prisma/schema.prisma` — Prisma schema
- `src/back-end/prisma/seed.ts` — `setTestAppData` helper; runs on first admin login, not via CLI
- `src/back-end/DAL/db-services` — database services layer
- `src/back-end/services` — non-DB server services (e.g. [`cookies.service.ts`](src/back-end/services/cookies.service.ts) wraps `await cookies()`)
- `src/back-end/server-actions` — server actions for auth and data operations
- `src/back-end/components` — React Server Components (no `"use client"`); client UI stays in `src/front-end/components`

---

## Authentication (details)

- Credentials authentication via custom auth service
- Google and GitHub OAuth providers
- Session handling with JWT callbacks
- Login flow handled in `src/front-end/components/login/login-form.tsx`
- Demo data is seeded when the admin user is created on first matching credentials login

---

## Testing

Unit and component tests use **Vitest** + **React Testing Library**.

- Config: [`vitest.config.mts`](vitest.config.mts), setup: [`vitest.setup.ts`](vitest.setup.ts)
- Test files: `tests/<file-under-test>.tests.ts(x)` next to the module (see `.cursor/rules/unit-tests.mdc`)
- Run watch: `npm run test`
- Run once: `npm run test:run`

Async Server Components are not covered by Vitest (use e2e later if needed). Controllers/DAL integration tests are out of scope for this setup.

---

## Debug

Front-end debugging:

```bash
npm run dev -- --inspect
```

Back-end debugging: use the VS Code debugger.

If auth behaves unexpectedly, verify `.env` / `.env.local` values and restart the server.

---

## Other experiments

- useLinkStatus hook
- `Image` component - Failed: required width property or styles workaround
- auth - NextAuth was implemented
- animation different breakpoints
- add local not-found.tsx for appropriate route for test (do not add global not-found - used default Next.js not found page)
- add import "server-only"; to back-end files
- split back-end on different layers (add server only) — FE / shared / BE boundaries + `server-only` / `"use server"` / `"use client"`
- caching - migrated to `cacheComponents: true` (`use cache` + `cacheTag` / `updateTag`)
- Add notfound page/function testing: `@notfound` (delayed `loading` → `notFound()`)
- Error boundaries for testing: root `error.tsx`, `(app)/error.tsx`, `global-error.tsx`, plus admin-only test buttons (`TestAppErrorButton` on Overview, `TestGlobalErrorButton` in root layout) — visible only to the admin user

---

## Todo / Roadmap

- calculate balance in right way
- add route handlers (only if a public HTTP API is needed — not for transaction table filters; those stay on Server Actions)
- migrate to partial prefetching
