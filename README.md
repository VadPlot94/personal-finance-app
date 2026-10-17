# Personal Finance App

Modern full-stack personal finance tracker built with Next.js, Prisma, and NextAuth.  
Track budgets, transactions, savings pots, and recurring bills with a clean and responsive interface.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth-5-000000?style=flat-square)](https://authjs.dev/)

---

[![Live Vercel Demo](https://img.shields.io/badge/Live%20Demo-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://personal-finance-app-nine-jade.vercel.app/)

---

## 📸 Screenshots

### Desktop Overview

![Desktop Overview](public/screenshots/desktop.png)

### Mobile View

![Mobile View](public/screenshots/mobile.png)

---

## 🚀 Features

- **Authentication**: Credentials, Google, and GitHub OAuth
- **Budget Management**: Create, edit, delete budgets with visual progress
- **Transactions**: Full income & expense tracking
- **Savings Pots**: Goal-based savings tracking
- **Recurring Bills**: Manage subscriptions and recurring payments
- **Responsive Design**: Excellent mobile and tablet experience
- **i18n**: `next-intl` (cookie locale; English messages, more locales later)
- **Dark/Light Mode** (planned)
- **Data Validation**: Zod + Server Actions

---

## 📁 Project Structure

- `src/app` — Next.js routes, layout, and pages
- `src/front-end` — client UI (`"use client"`), services, auth, and page features
- `src/back-end` — Prisma, DB services, server actions, and server components (`src/back-end/components`)
- `src/shared` — shared types and validation utilities, i18n config
- `src/app/i18n` — next-intl request config (server)
- `messages/` — nested translation JSON catalogs
- `src/types` — TypeScript declarations

**Developer notes:** [README-dev.md](README-dev.md) (architecture decisions, backend map, debug, experiments, roadmap)

---

## 💻 Getting Started

### Requirements

- Node.js 20+
- npm 10+
- PostgreSQL, SQLite, or Prisma-compatible database

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file in the project root and add the required values:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

> Use `#` for comments in dotenv files, not `//`.

### Run locally

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

---

## 🛠 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production app |
| `npm run start` | Run production server |
| `npm run lint` | Run Biome lint checks |
| `npm run format-and-fix` | Format code with Biome and lint checks |
| `npm run format` | Light Format version - only code formatting (without for ex: import sorting) |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run Vitest once (CI / one-shot) |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Push Prisma schema to database |
| `npm run recreate-db` | Generate Prisma client and push schema (no seed) |

---

## 🧩 Pages

- `/` — app landing page
- `/login` — sign in / register page
- `/overview` — authenticated app shell
- `/budgets` — budgets dashboard
- `/pots` — savings pots page
- `/recurring` — recurring payments page
- `/transactions` — transactions page

---

## 📚 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: Prisma + PostgreSQL
- **Auth**: NextAuth.js v5 (Auth.js)
- **Validation**: Zod
- **UI** Shadcn/ui + custom components
- **Notifications**: Sonner
- **i18n**: next-intl
- **Linting/Formatting**: Biome

---

Made with ❤️ by Vadim Plotnikov

---
