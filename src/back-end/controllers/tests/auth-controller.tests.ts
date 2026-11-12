import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/shared/lib/test-utils/logger.service.mock";
import { CustomError } from "@/back-end/common/errors";

vi.mock("@/back-end/DAL/db-services/auth.service", () => ({
  default: {
    authUser: vi.fn(),
    getSessionOrRedirectToLoginPage: vi.fn(),
    getAuthenticatedSession: vi.fn(),
  },
}));

import authController from "@/back-end/controllers/auth-controller";
import authService from "@/back-end/DAL/db-services/auth.service";
import { AuthMode } from "@/shared/services/constants.service";

describe("AuthController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("delegates to authUser in register mode without requiring a session", async () => {
      // Arrange
      const credentials = {
        email: "user@example.com",
        password: "secret1",
        name: "Vad",
      };
      vi.mocked(authService.authUser).mockResolvedValue({
        id: "user-1",
        email: credentials.email,
      });

      // Act
      const result = await authController.registerUser(credentials);

      // Assert
      expect(authService.authUser).toHaveBeenCalledWith(
        AuthMode.Register,
        credentials,
      );
      expect(authService.getAuthenticatedSession).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe("user-1");
    });
  });

  describe("autorizeUser", () => {
    it("delegates to authUser in sign-in mode", async () => {
      // Arrange
      const credentials = {
        email: "user@example.com",
        password: "secret",
      };
      vi.mocked(authService.authUser).mockResolvedValue({
        id: "user-1",
        email: credentials.email,
      });

      // Act
      const result = await authController.autorizeUser(credentials);

      // Assert
      expect(authService.authUser).toHaveBeenCalledWith(
        AuthMode.SignIn,
        credentials,
      );
      expect(result.success).toBe(true);
    });
  });

  describe("ensureSession", () => {
    it("returns the session from authService", async () => {
      // Arrange
      const session = { user: { id: "user-1" } } as Session;
      vi.mocked(authService.getSessionOrRedirectToLoginPage).mockResolvedValue(
        session,
      );

      // Act
      const result = await authController.ensureSession();

      // Assert
      expect(result).toBe(session);
    });
  });

  describe("getOptionalSession", () => {
    it("returns null when authentication fails", async () => {
      // Arrange
      vi.mocked(authService.getAuthenticatedSession).mockRejectedValue(
        new CustomError("Unauthorized"),
      );

      // Act
      const result = await authController.getOptionalSession();

      // Assert
      expect(result).toBeNull();
    });

    it("returns the session when authenticated", async () => {
      // Arrange
      const session = { user: { id: "user-1" } } as Session;
      vi.mocked(authService.getAuthenticatedSession).mockResolvedValue(session);

      // Act
      const result = await authController.getOptionalSession();

      // Assert
      expect(result).toBe(session);
    });
  });

  describe("isAdminSession", () => {
    it("returns true for an admin session user", async () => {
      // Arrange
      vi.mocked(authService.getAuthenticatedSession).mockResolvedValue({
        user: { id: "user-1", isAdmin: true },
      } as Session);

      // Act
      const result = await authController.isAdminSession();

      // Assert
      expect(result).toBe(true);
    });

    it("returns false when there is no session", async () => {
      // Arrange
      vi.mocked(authService.getAuthenticatedSession).mockRejectedValue(
        new CustomError("Unauthorized"),
      );

      // Act
      const result = await authController.isAdminSession();

      // Assert
      expect(result).toBe(false);
    });
  });
});
