import { describe, expect, it } from "vitest";
import authService from "@/front-end/services/auth.service";
import { AuthMode } from "@/shared/services/constants.service";

describe("AuthService", () => {
  describe("getValidAuthMode", () => {
    it("defaults to SignIn when authMode is undefined", () => {
      // Arrange & Act
      const result = authService.getValidAuthMode(undefined);

      // Assert
      expect(result).toBe(AuthMode.SignIn);
    });

    it("accepts a valid register mode", () => {
      // Arrange & Act
      const result = authService.getValidAuthMode(AuthMode.Register);

      // Assert
      expect(result).toBe(AuthMode.Register);
    });

    it("decodes a URI-encoded auth mode", () => {
      // Arrange
      const encoded = encodeURIComponent(AuthMode.Register);

      // Act
      const result = authService.getValidAuthMode(encoded);

      // Assert
      expect(result).toBe(AuthMode.Register);
    });

    it("falls back to SignIn for unknown values", () => {
      // Arrange & Act
      const result = authService.getValidAuthMode("not-a-mode");

      // Assert
      expect(result).toBe(AuthMode.SignIn);
    });
  });
});
