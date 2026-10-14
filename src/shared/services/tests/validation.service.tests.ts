import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/shared/lib/test-utils/logger.service.mock";
import validationService from "@/shared/services/validation.service";

describe("ValidationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateSignInSchema", () => {
    it("accepts valid credentials", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "secret",
      };

      // Act
      const result = validationService.validateSignInSchema(formData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      // Arrange
      const formData = {
        email: "not-an-email",
        password: "secret",
      };

      // Act
      const result = validationService.validateSignInSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("rejects empty password", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "",
      };

      // Act
      const result = validationService.validateSignInSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe("validateRegisterSchema", () => {
    it("accepts valid registration data", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "secret1",
        name: "Vad",
      };

      // Act
      const result = validationService.validateRegisterSchema(formData);

      // Assert
      expect(result.success).toBe(true);
    });

    it("rejects short password", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "123",
        name: "Vad",
      };

      // Act
      const result = validationService.validateRegisterSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });

    it("rejects empty name", () => {
      // Arrange
      const formData = {
        email: "user@example.com",
        password: "secret1",
        name: "",
      };

      // Act
      const result = validationService.validateRegisterSchema(formData);

      // Assert
      expect(result.success).toBe(false);
    });
  });
});
