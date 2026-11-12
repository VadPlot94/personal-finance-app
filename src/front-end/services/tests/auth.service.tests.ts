import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

import { signOut } from "next-auth/react";
import authService from "@/front-end/services/auth.service";
import constants, { AuthMode } from "@/shared/services/constants.service";

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  describe("signOut", () => {
    it("calls next-auth signOut with the default home callback", async () => {
      // Arrange
      vi.mocked(signOut).mockResolvedValue(undefined as never);

      // Act
      await authService.signOut();

      // Assert
      expect(signOut).toHaveBeenCalledWith({
        callbackUrl: constants.AppRoutes.home,
        redirect: true,
      });
    });

    it("uses a custom callback URL when provided", async () => {
      // Arrange
      vi.mocked(signOut).mockResolvedValue(undefined as never);

      // Act
      await authService.signOut("/login");

      // Assert
      expect(signOut).toHaveBeenCalledWith({
        callbackUrl: "/login",
        redirect: true,
      });
    });
  });
});
