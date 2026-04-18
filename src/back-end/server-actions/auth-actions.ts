"use server";

import { CustomError, validationObjectWrapper } from "./common";
import userService from "../DAL/db-services/user.service";
import { User } from "@prisma/client";
import validationService from "@/shared/services/validation.service";
import { IRegisterValidationData } from "@/shared/services/types";
import { ServerActionResult } from "./types";
import { Session } from "next-auth";

export async function registerUser(
  credentials: unknown,
): Promise<ServerActionResult<Partial<User> | null>> {
  return await validationObjectWrapper<Partial<User> | null>(
    "create",
    async (session?: Session) => {
      const result = validationService.validateRegisterSchema(
        credentials as IRegisterValidationData,
      );

      if (!result.success) {
        const errors =
          validationService.createErrorsWithPath<IRegisterValidationData>(
            result,
          );
        throw new CustomError("Validation error", errors);
      }

      const validatedData = result.data;

      // Check if user already exists
      const existingUser = await userService.findByEmail(validatedData.email);
      if (existingUser) {
        throw new CustomError("User with this email already exists");
      }

      // Create new user
      const user = await userService.createUser(
        validatedData.email,
        validatedData.password,
        validatedData.name,
      );

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    },
    { requireAuth: false },
  );
}
