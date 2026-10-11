# Check and Commit

Fail-fast pipeline: CI gate → browser smoke → commit → push. Do **not** skip steps or continue past a failure.

## Workflow

Copy and track:

```
Check and Commit:
- [ ] Step 1: /ci-quality-check
- [ ] Step 2: Browser sanity / smoke
- [ ] Step 3: Commit (git-commit.mdc)
- [ ] Step 4: Push to origin
```

### Step 1 — CI quality gate

1. Read and fully execute [`.cursor/skills/ci-quality-check.mdc`](../skills/ci-quality-check.mdc) (same workflow as `/ci-quality-check`).
2. Continue **only** when the verdict is **READY TO COMMIT**.
3. On **BLOCKED**: stop. Report blockers. Do **not** run browser checks, commit, or push.

### Step 2 — Browser sanity / regression smoke

1. Look for automated smoke / e2e / regression tests:
   - `package.json` scripts: `test`, `test:e2e`, `test:smoke`, or similar
   - Playwright / Cypress config in the repo
2. If any exist: run them. On non-zero exit — **stop**. Do not commit or push.
3. If none exist: manual smoke via **cursor-ide-browser** against the local app (default base URL `http://localhost:3000`):
   - Ensure `next dev` is running (start it if nothing is listening on the port).
   - Visit core routes: `/login`, `/overview`, `/transactions`, `/budgets`, `/pots`, `/recurring`.
   - Per route pass criteria: page loads; no Next.js error overlay / obvious crash; main content visible (snapshot or screenshot).
   - Auth-gated pages: redirect to login is OK when unauthenticated. Do **not** invent credentials. If a session already exists, verify the authenticated page renders.
4. On any hard failure (crash, overlay, 500, blank broken page): **stop**. Report broken routes. Do not commit or push.

### Step 3 — Commit

1. Follow [`.cursor/rules/git-commit.mdc`](../rules/git-commit.mdc) exactly.
2. Show file list, proposed message (`[branch_name] description`), and alternatives.
3. **Wait for explicit user confirmation** before running `git commit`.
4. Never skip confirmation. Never commit secrets (`.env`, credentials, etc.).

### Step 4 — Push

1. Run only after a successful commit (`git log -1 --oneline`).
2. Push the current branch to its origin upstream:
   - If upstream exists: `git push`
   - If no upstream: `git push -u origin HEAD`
3. Do **not** force-push. Do **not** push if the user declined the commit.
4. Report the branch name and push result.

## Stop rules

| Gate | On failure |
|------|------------|
| CI not READY TO COMMIT | Stop — no browser, commit, or push |
| Smoke / browser fail | Stop — no commit or push |
| User declines commit | Stop — no push |
| Commit fails | Stop — no push |
