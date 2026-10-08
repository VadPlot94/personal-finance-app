"use server";
import "server-only";

import type { User } from "@prisma/client";
import type { Session } from "next-auth";
import authService from "@/back-end/DAL/db-services/auth.service";
import { validationObjectWrapper } from "@/back-end/server-actions/common";
import type { ServerActionResult } from "@/back-end/server-actions/types";

export async function registerUserServerAction(
  credentials: unknown,
): Promise<ServerActionResult<Partial<User> | null>> {
  return await validationObjectWrapper<Partial<User> | null>(
    "create",
    async () =>
      authService.authUser(
        "register",
        credentials as unknown as
          | Partial<Record<"name" | "email" | "password", unknown>>
          | undefined,
      ),
    { requireAuth: false },
  );
}

/** RSC helper: redirects to /login when unauthenticated. */
export async function ensureSessionServerAction(): Promise<Session> {
  return authService.getSessionOrRedirectToLoginPage();
}

/** RSC helper for login page: returns session if authenticated, otherwise null. */
export async function getOptionalSessionServerAction(): Promise<Session | null> {
  try {
    return await authService.getAuthenticatedSession();
  } catch {
    return null;
  }
}
