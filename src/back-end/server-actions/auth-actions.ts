"use server";
import "server-only";

import type { User } from "@prisma/client";
import type { Session } from "next-auth";
import authController from "@/back-end/controllers/auth-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";

export async function registerUserSRF(
  credentials: unknown,
): Promise<ValidationResponse<Partial<User> | null>> {
  return authController.registerUser(credentials);
}

/** RSC helper: redirects to /login when unauthenticated. */
export async function ensureSessionSRF(): Promise<Session> {
  return authController.ensureSession();
}

/** RSC helper for login page: returns session if authenticated, otherwise null. */
export async function getOptionalSessionSRF(): Promise<Session | null> {
  return authController.getOptionalSession();
}

/** True when the current session user was persisted as admin (User.isAdmin). */
export async function isAdminSessionSRF(): Promise<boolean> {
  return authController.isAdminSession();
}
