"use server";
import "server-only";

import type { User } from "@prisma/client";
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
