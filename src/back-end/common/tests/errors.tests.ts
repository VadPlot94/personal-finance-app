import { describe, expect, it } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/shared/lib/test-utils/logger.service.mock";
import { CustomError, throwValidationError } from "@/back-end/common/errors";
import validationService from "@/shared/services/validation.service";

describe("CustomError", () => {
  it("marks itself as a custom error", () => {
    // Arrange & Act
    const error = new CustomError("Unauthorized");

    // Assert
    expect(error.isCustomError).toBe(true);
    expect(error.message).toBe("Unauthorized");
    expect(error.isZodError).toBe(false);
  });

  it("marks zod errors when field errors are provided", () => {
    // Arrange & Act
    const error = new CustomError("Validation error", {
      email: "i18n.Validation.InvalidEmail",
    });

    // Assert
    expect(error.isZodError).toBe(true);
    expect(error.zodErrors).toEqual({
      email: "i18n.Validation.InvalidEmail",
    });
  });
});

describe("throwValidationError", () => {
  it("does nothing when validation succeeds", () => {
    // Arrange
    const result = validationService.validateSignInSchema({
      email: "user@example.com",
      password: "secret",
    });

    // Act & Assert
    expect(() => throwValidationError(result)).not.toThrow();
  });

  it("throws CustomError with mapped zod field errors", () => {
    // Arrange
    const result = validationService.validateSignInSchema({
      email: "bad",
      password: "",
    });

    // Act & Assert
    expect(() => throwValidationError(result)).toThrow(CustomError);
    try {
      throwValidationError(result);
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
      expect((error as CustomError).isZodError).toBe(true);
      expect((error as CustomError).zodErrors?.email).toBe(
        "i18n.Validation.InvalidEmail",
      );
    }
  });
});
