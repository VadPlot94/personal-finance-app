import "server-only";
import logger from "@/shared/services/logger.service";

/** Server-only auth demo credentials from env (values live in `.env`, not in git). */
export const authEnv = {
  email: process.env.AUTH_EMAIL,
  password: process.env.AUTH_PASSWORD,
} as const;

export function warnIfAuthEnvMissing(): void {
  const { email: adminEmail, password: adminPassword } = authEnv;
  if (!adminEmail || !adminPassword) {
    logger.logWarn(
      "[auth] AUTH_EMAIL and AUTH_PASSWORD environment variables are not set",
    );
  }
}
