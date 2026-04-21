"use server";

import { validationObjectWrapper } from "./common";
import authService from "../DAL/db-services/auth.service";
import { User } from "@prisma/client";
import { ServerActionResult } from "./types";

export async function registerUserServerAction(
  credentials: unknown,
): Promise<ServerActionResult<Partial<User> | null>> {
  return await validationObjectWrapper<Partial<User> | null>(
    "create",
    async () => authService.authUser("register", credentials as any),
    { requireAuth: false },
  );
}
