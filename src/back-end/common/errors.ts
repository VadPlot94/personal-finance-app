import "server-only";
import type { ZodSafeParseResult } from "zod";
import validationService from "@/shared/services/validation.service";

export class CustomError extends Error {
  public isCustomError = true as const;
  public readonly isZodError: boolean;

  constructor(
    public message: string,
    public zodErrors?: Record<string, string>,
  ) {
    super(message);
    this.isZodError = !!zodErrors;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export function throwValidationError<T>(
  zodValidationResult: ZodSafeParseResult<T>,
): void {
  if (!zodValidationResult?.success) {
    const errors = validationService.createErrorsWithPath<T>(
      zodValidationResult,
    ) as Record<keyof T, string>;
    throw new CustomError("Validation error", errors);
  }
}
