import "server-only";

/** Server-only auth demo credentials from env (values live in `.env`, not in git). */
export const authEnv = {
  email: process.env.AUTH_EMAIL,
  password: process.env.AUTH_PASSWORD,
} as const;
