# Contributing

Thanks for helping improve **Personal Finance App**.

This guide is for people who want to fix bugs, improve docs, or add features.  
If you only need to run the app locally, start with [README.md](README.md). Deep architecture notes: [README-dev.md](README-dev.md).

## Ways to contribute

- Report bugs and propose features via GitLab Issues
- Improve documentation (README, comments only when asked / needed for lint)
- Fix bugs or add tests
- Small, focused pull / merge requests are preferred over large mixed ones

## Development setup

1. Fork and clone the repository
2. Install Node.js 20.9+ and npm 10+ (Node 26 / npm 11 are fine)
3. Copy `.env.example` → `.env` and fill required values (`DATABASE_URL`, `NEXTAUTH_*`, `AUTH_*`)
4. `npm install` (or `npm ci --ignore-scripts` then `npm run recreate-db` if DB is not ready during install)
5. `npm run dev`

## Branch & commit workflow

1. Create a branch from `main`: `feature/…`, `fix/…`, or `docs/…`
2. Keep changes scoped to one concern
3. Run checks before opening an MR:

```bash
npm run format-and-fix
npm run test:run
```

4. Open a Merge Request against `main` with a short description of **why** the change exists

## Code conventions (short)

- Follow project Cursor rules / `AGENTS.md` (layers FE / shared / BE, naming, tests)
- Prefer Server Components; keep `"use client"` small
- Do not edit `src/front-end/components/ui/*` (shadcn) unless the change explicitly requires it
- Unit tests: colocated `tests/<file>.tests.ts(x)` — see `.cursor/rules/unit-tests.mdc`
- Never commit secrets, real credentials, or production `.env` files

## Pull / Merge Request checklist

- [ ] Purpose of the change is clear in the description
- [ ] Lint / format pass
- [ ] Relevant tests added or updated (`npm run test:run`)
- [ ] Docs updated when behavior or setup changes (`README.md` / `README-dev.md` / this file)
- [ ] No secrets in the diff

## Security issues

Do **not** open a public issue for vulnerabilities. See [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the same [MIT License](LICENSE.md) as the project.
