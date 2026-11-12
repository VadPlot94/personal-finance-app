import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/shared/lib/test-utils/logger.service.mock";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/back-end/DAL/db-services/user.service", () => ({
  default: {
    getUser: vi.fn(),
    findByEmail: vi.fn(),
    createUser: vi.fn(),
    setIsAdmin: vi.fn(),
  },
}));

vi.mock("@/back-end/prisma/seed", () => ({
  setTestAppData: vi.fn(),
}));

vi.mock("@/back-end/config/auth-env", () => ({
  authEnv: {
    email: "admin@example.com",
    password: "admin-secret",
  },
}));

import authService from "@/back-end/DAL/db-services/auth.service";
import { AuthMode } from "@/shared/services/constants.service";

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getValidCredentials", () => {
    it("returns null when email is missing", () => {
      // Arrange & Act
      const result = authService.getValidCredentials(
        { password: "secret" },
        AuthMode.SignIn,
      );

      // Assert
      expect(result).toBeNull();
    });

    it("returns null when password is missing", () => {
      // Arrange & Act
      const result = authService.getValidCredentials(
        { email: "user@example.com" },
        AuthMode.SignIn,
      );

      // Assert
      expect(result).toBeNull();
    });

    it("trims and lowercases email for valid sign-in credentials", () => {
      // Arrange & Act
      const result = authService.getValidCredentials(
        {
          email: "  User@Example.COM ",
          password: "secret",
        },
        AuthMode.SignIn,
      );

      // Assert
      expect(result).toEqual({
        email: "user@example.com",
        password: "secret",
        name: undefined,
      });
    });

    it("returns null when register validation fails", () => {
      // Arrange & Act
      const result = authService.getValidCredentials(
        {
          email: "user@example.com",
          password: "secret1",
        },
        AuthMode.Register,
      );

      // Assert
      expect(result).toBeNull();
    });

    it("includes name for valid register credentials", () => {
      // Arrange & Act
      const result = authService.getValidCredentials(
        {
          email: "user@example.com",
          password: "secret1",
          name: "Vad",
        },
        AuthMode.Register,
      );

      // Assert
      expect(result).toEqual({
        email: "user@example.com",
        password: "secret1",
        name: "Vad",
      });
    });
  });

  describe("isAdminUser", () => {
    it("is true when email and password match auth env", () => {
      // Arrange & Act
      const result = authService.isAdminUser(
        "Admin@Example.com",
        "admin-secret",
      );

      // Assert
      expect(result).toBe(true);
    });

    it("is false when password does not match", () => {
      // Arrange & Act
      const result = authService.isAdminUser(
        "admin@example.com",
        "wrong-password",
      );

      // Assert
      expect(result).toBe(false);
    });

    it("is false when email does not match", () => {
      // Arrange & Act
      const result = authService.isAdminUser(
        "other@example.com",
        "admin-secret",
      );

      // Assert
      expect(result).toBe(false);
    });
  });
});
