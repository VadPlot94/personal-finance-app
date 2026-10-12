"use server";
import "server-only";

import type { User } from "@prisma/client";
import authController from "@/back-end/controllers/auth-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";

export async function registerUserSRF(
  credentials: unknown,
): Promise<ValidationResponse<Partial<User> | null>> {
  return authController.registerUser(credentials);
}

export async function isAdminSessionSRF(): Promise<boolean> {
  return authController.isAdminSession();
}
