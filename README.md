# Personal Finance App

<div align="center">

**Track spending, budgets, savings pots, and recurring bills** in one responsive dashboard.

Built as a full-stack solution to the [Frontend Mentor — Personal finance app](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1) challenge.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Auth.js](https://img.shields.io/badge/Auth.js-5-000000?style=for-the-badge&logo=auth0&logoColor=white)](https://authjs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE.md)

<br />

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://personal-finance-app-nine-jade.vercel.app/)
[![GitLab](https://img.shields.io/badge/GitLab-Repo-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white)](https://gitlab.com/frontendmentor4274851/personal-finance-app)

[Demo](https://personal-finance-app-nine-jade.vercel.app/) · [Challenge](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1) · [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md) · [Dev notes](README-dev.md)

</div>

---

## Table of contents

- [What this app is for](#what-this-app-is-for)
- [Screenshots](#screenshots)
- [How to use the app](#how-to-use-the-app)
- [Features](#features)
- [Pages](#pages)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure — what lives where](#project-structure--what-lives-where)
- [Available scripts](#available-scripts)
- [Links](#links)
- [License](#license)

---

## What this app is for

This app is a **personal finance dashboard**.

It helps you see money in one place:

| You want to… | Open this page |
| --- | --- |
| See balance, recent activity, and summaries at a glance | **Overview** |
| Log income & expenses, search/filter them | **Transactions** |
| Cap spending by category and watch progress | **Budgets** |
| Save toward goals (holiday, laptop, gifts…) | **Pots** |
| Track subscriptions / monthly bills | **Recurring Bills** |

**Balance math (important):**  
Current balance, income, and expenses come from posted **transactions** (income = positive amounts, expenses = absolute sum of negatives). Budgets and pots are overlays on top of that — they do not invent a separate ledger.

Demo data is seeded automatically the first time the **admin** credentials from env log in successfully.

---

## Screenshots

### Landing & auth

| Landing (`/`) | Sign in |
| :---: | :---: |
| ![Desktop Landing](public/screenshots/desktop-landing.png) | ![Desktop Login](public/screenshots/desktop-login.png) |

### Desktop app

| Overview | Overview (menu open) |
| :---: | :---: |
| ![Desktop Overview](public/screenshots/desktop-overview.png) | ![Desktop Overview menu open](public/screenshots/desktop-overview-menu-open.png) |

| Budgets | Transactions |
| :---: | :---: |
| ![Desktop Budgets](public/screenshots/desktop-budgets.png) | ![Desktop Transactions](public/screenshots/desktop-transactions.png) |

| Pots | Recurring Bills |
| :---: | :---: |
| ![Desktop Pots](public/screenshots/desktop-pots.png) | ![Desktop Recurring](public/screenshots/desktop-recurring.png) |

### Intermediate (`sm`–`md`, ~700px) — bottom nav **with labels**

Horizontal menu between phone icons-only and tablet vertical sidebar (`max-sm` hides labels; `md` switches to vertical).

| Overview | Transactions |
| :---: | :---: |
| <img src="public/screenshots/sm-overview-nav-labels.png" width="360" alt="sm Overview with nav labels" /> | <img src="public/screenshots/sm-transactions-nav-labels.png" width="360" alt="sm Transactions with nav labels" /> |

### Tablet & mobile

| Tablet Overview (768px) | Tablet Overview (menu open) |
| :---: | :---: |
| <img src="public/screenshots/tablet-overview.png" width="360" alt="Tablet Overview" /> | <img src="public/screenshots/tablet-overview-menu-open.png" width="360" alt="Tablet Overview menu open" /> |

| Mobile Overview (390px) | Mobile Budgets |
| :---: | :---: |
| <img src="public/screenshots/mobile-overview.png" width="240" alt="Mobile Overview" /> | <img src="public/screenshots/mobile-budgets.png" width="240" alt="Mobile Budgets" /> |

| Mobile Transactions | Mobile Pots |
| :---: | :---: |
| <img src="public/screenshots/mobile-transactions.png" width="240" alt="Mobile Transactions" /> | <img src="public/screenshots/mobile-pots.png" width="240" alt="Mobile Pots" /> |

| Mobile Recurring |
| :---: |
| <img src="public/screenshots/mobile-recurring.png" width="240" alt="Mobile Recurring" /> |

> Screenshots were captured with Playwright at fixed viewports (`1440×900`, `768×1024`, `700×900` for `sm`–`md` labeled bottom nav, `390×844`). Regenerate with `node scripts/capture-readme-screenshots.mjs` while `npm run dev` is running.

---

## How to use the app

### 1. Sign in

1. Open the [live demo](https://personal-finance-app-nine-jade.vercel.app/) or your local `http://localhost:3000`.
2. Go to **Sign in** (`/login`).
3. Use **email + password**, or **Google / GitHub** if those OAuth env vars are configured.
4. After a successful login you land on **Overview**.

On local/dev, the admin pair from `AUTH_EMAIL` / `AUTH_PASSWORD` also bootstraps demo seed data on first login.

### 2. Navigate

- **Desktop / tablet:** dark sidebar on the left (icons expand with “Maximize Menu”).
- **Mobile:** bottom navigation bar.
- Header **EN / RU** switcher changes the UI language (cookie-based via `next-intl`).

### 3. Overview — “home screen”

Purpose: one-screen snapshot of your finances.

- Top cards: **Current Balance**, **Income**, **Expenses**
- Tiles: **Pots**, **Transactions**, **Budgets**, **Recurring Bills**
- Use **See details / View All** on a tile to jump into that full page

### 4. Transactions — record money in/out

Purpose: the source of truth for balances.

- **Create Transaction** — add income or expense
- **Search** by name
- **Sort** and **category filter**
- **Pagination** for long histories

### 5. Budgets — limit spending by category

Purpose: set a monthly-style limit per category and see how much is left.

- **Add Budget** — pick category, max amount, theme color
- Donut chart shows share of spend across budgets
- Each card shows spent / remaining, warnings when almost used or over limit
- **See all** opens filtered transactions for that category

### 6. Pots — save toward a goal

Purpose: earmark money for a named target (not a bank transfer — an in-app savings goal).

- **Add New Pot** — name, target, color
- **Add Money / Withdraw** — move amounts relative to the pot total
- Progress bar shows % of target reached

### 7. Recurring Bills — subscriptions & fixed payments

Purpose: see what repeats monthly and what is paid / upcoming / due soon.

- **Add Recurring Bill**
- Search + sort the list
- Summary cards: total bills, paid, upcoming, due soon

### 8. Sign out

Use the **Sign Out** control in the sidebar / bottom nav when you are done.

---

## Features

- **Authentication**: credentials + Google + GitHub (Auth.js / NextAuth v5)
- **Budget management**: create / edit / delete budgets with visual progress and near-limit warnings
- **Transactions**: full income & expense tracking with search, sort, filter, pagination
- **Savings pots**: goal-based tracking with add / withdraw
- **Recurring bills**: subscriptions and fixed payments with paid / upcoming / due-soon summary
- **Responsive design**: mobile bottom nav, desktop / tablet sidebar
- **i18n**: English & Russian (`next-intl`, cookie locale + header switcher)
- **Data validation**: Zod + Server Actions
- **Tests & CI**: Vitest unit/component tests + GitLab CI coverage
- **Dark / Light mode** (planned)

---

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page |
| `/login` | Sign in / register |
| `/overview` | Authenticated home (balance + summary tiles) |
| `/transactions` | Full transactions table |
| `/budgets` | Budgets dashboard |
| `/pots` | Savings pots |
| `/recurring` | Recurring bills |

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Database | [Prisma 6](https://www.prisma.io/) + PostgreSQL (or other Prisma-compatible DB) |
| Auth | [Auth.js / NextAuth 5](https://authjs.dev/) |
| Validation | [Zod](https://zod.dev/) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |
| i18n | [next-intl](https://next-intl.dev/) |
| Tests | [Vitest](https://vitest.dev/) + Testing Library |
| Lint / format | [Biome](https://biomejs.dev/) |
| Deploy demo | [Vercel](https://vercel.com/) |

---

## Getting started

### Requirements

- Node.js **20.9+** (Next.js 16 minimum; Current releases such as Node 26 are fine)
- npm **10+** (npm 11 supported)
- PostgreSQL, SQLite, or another Prisma-compatible database

### Install

```bash
git clone https://gitlab.com/frontendmentor4274851/personal-finance-app.git
cd personal-finance-app
npm install
```

`postinstall` runs Prisma generate + schema push. If you have no DB yet, use `npm ci --ignore-scripts` then configure env and run `npm run recreate-db`.

### Environment

Copy [`.env.example`](.env.example) to `.env` (or `.env.local`) and fill in values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-long-random-string"
AUTH_EMAIL="admin@example.com"
AUTH_PASSWORD="your-admin-password"
# Optional OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

> Use `#` for comments in dotenv files, not `//`.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register a user or sign in with the admin pair to load demo data.

Architecture decisions and backend map live in [README-dev.md](README-dev.md).

---

## Project structure — what lives where

Code is split by **where it runs**, plus Next.js convention folders you should not rename.

| Folder | What it is for |
| --- | --- |
| `src/front-end/` | **Browser / client side** — UI components, client helpers, anything that runs in the user’s browser (`"use client"` and related FE code) |
| `src/back-end/` | **Server side** — Prisma, DB services, controllers, server actions, other code that must stay on the server |
| `src/shared/` | **Shared by both** — types, validation, constants, helpers that front-end and back-end are allowed to import (safe on client and server) |
| `src/app/` | **Next.js App Router** — routes, `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, etc. Thin convention wrappers; keep real UI in `front-end` when possible |
| `src/lib/` | Framework wiring that sits next to the app (e.g. Auth.js config) |
| `src/i18n/messages/` | Translation JSON catalogs |
| `src/types/` | Global TypeScript declarations |
| `public/` | Static assets (images, screenshots) |

**In plain words:**

1. Need a button, form, or chart the user clicks? → `front-end`
2. Need the database, secrets, or server-only logic? → `back-end`
3. Need the same type / validator / constant in both places? → `shared`
4. Need a URL / route that Next.js understands? → `src/app` (do not invent a different router folder — App Router conventions stay as Next requires)

More detail (who may import whom, RSC vs Server Actions): [README-dev.md](README-dev.md).

### Quick “where do I open this file?”

| Need | Path |
| --- | --- |
| A screen / route | `src/app/…` |
| A visible UI component | `src/front-end/components/…` |
| Client-side helper / service | `src/front-end/services/…` |
| Server action (`*SRF`) | `src/back-end/server-actions/…` |
| Controller / DB service / Prisma | `src/back-end/…` |
| Shared type or Zod schema | `src/shared/…` |
| Auth config | `src/lib/auth.ts` |
| Translations | `src/i18n/messages/…` |
| README screenshots | `public/screenshots/` |
| CI | `.gitlab-ci.yml` |

---

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Build production app |
| `npm run start` | Run production server |
| `npm run lint` | Biome lint checks |
| `npm run format` | Format only (lighter than full check — e.g. no import sorting) |
| `npm run format-and-fix` | Format + lint fixes via Biome |
| `npm run test` | Vitest watch mode (local) |
| `npm run test:run` | Vitest once (CI / agents) |
| `npm run test:ui` | Vitest UI in the browser |
| `npm run test:coverage` | Tests + coverage under `coverage/` |
| `npm run test:coverage:open` | Same as coverage, then open the HTML report |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:push` | Push schema to DB |
| `npm run recreate-db` | Generate + push (no seed CLI) |

---

## Links

- **Live demo:** https://personal-finance-app-nine-jade.vercel.app/
- **Repository:** https://gitlab.com/frontendmentor4274851/personal-finance-app
- **Challenge:** https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1
- **Developer notes:** [README-dev.md](README-dev.md)

---

## License

Distributed under the **MIT License**. See [LICENSE.md](LICENSE.md).

Made with ❤️ by Vadim Plotnikov ([@VadPlot94](https://github.com/VadPlot94))
