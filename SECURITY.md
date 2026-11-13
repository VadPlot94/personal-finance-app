# Security Policy

## Supported versions

This project is under active development. Security fixes are applied on the default branch (`main`).

| Version | Supported |
| --- | --- |
| `main` / `0.1.x` | Yes |

## Reporting a vulnerability

Please **do not** open a public GitLab issue for security problems.

Instead, contact the maintainer privately (GitLab private message / email associated with the project) and include:

- A short description of the issue
- Steps to reproduce (or a proof-of-concept)
- Impact assessment if known

You should receive an acknowledgement when possible. Please give reasonable time for a fix before any public disclosure.

## Safe contributing

- Never commit `.env`, API keys, OAuth secrets, or real user data
- Use the synthetic values from `.env.example` in docs and tests
- Prefer least-privilege OAuth app settings in Google / GitHub consoles
