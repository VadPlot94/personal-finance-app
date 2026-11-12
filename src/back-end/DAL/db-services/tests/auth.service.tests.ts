import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/shared/lib/test-utils/logger.service.mock";
import { CustomError } from "@/back-end/common/errors";

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

import { redirect } from "next/navigation";
import authService from "@/back-end/DAL/db-services/auth.service";
import userService from "@/back-end/DAL/db-services/user.service";
import { setTestAppData } from "@/back-end/prisma/seed";
import { auth } from "@/lib/auth";
import constants, { AuthMode } from "@/shared/services/constants.service";

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

  describe("authUser", () => {
    it("returns null when credentials are invalid", async () => {
      // Arrange & Act
      const result = await authService.authUser(AuthMode.SignIn, {
        email: "bad",
        password: "",
      });

      // Assert
      expect(result).toBeNull();
      expect(userService.getUser).not.toHaveBeenCalled();
    });

    it("registers a new user through the register path", async () => {
      // Arrange
      vi.mocked(userService.findByEmail).mockResolvedValue(null);
      vi.mocked(userService.createUser).mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        name: "Vad",
        isAdmin: false,
      } as never);

      // Act
      const result = await authService.authUser(AuthMode.Register, {
        email: "user@example.com",
        password: "secret1",
        name: "Vad",
      });

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(
        "user@example.com",
        "secret1",
        "Vad",
      );
      expect(result).toEqual({
        id: "user-1",
        email: "user@example.com",
        name: "Vad",
        isAdmin: false,
      });
    });

    it("throws when registering an email that already exists", async () => {
      // Arrange
      vi.mocked(userService.findByEmail).mockResolvedValue({
        id: "existing",
      } as never);

      // Act & Assert
      await expect(
        authService.authUser(AuthMode.Register, {
          email: "user@example.com",
          password: "secret1",
          name: "Vad",
        }),
      ).rejects.toBeInstanceOf(CustomError);
      expect(userService.createUser).not.toHaveBeenCalled();
    });

    it("signs in an existing user with a valid password", async () => {
      // Arrange
      vi.mocked(userService.getUser).mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        name: "Vad",
        isAdmin: false,
      } as never);

      // Act
      const result = await authService.authUser(AuthMode.SignIn, {
        email: "user@example.com",
        password: "secret",
      });

      // Assert
      expect(result).toEqual({
        id: "user-1",
        email: "user@example.com",
        name: "Vad",
        isAdmin: false,
      });
      expect(userService.setIsAdmin).not.toHaveBeenCalled();
    });

    it("backfills isAdmin when env admin signs in with isAdmin false", async () => {
      // Arrange
      vi.mocked(userService.getUser).mockResolvedValue({
        id: "admin-1",
        email: "admin@example.com",
        name: "Admin",
        isAdmin: false,
      } as never);
      vi.mocked(userService.setIsAdmin).mockResolvedValue({
        id: "admin-1",
        email: "admin@example.com",
        name: "Admin",
        isAdmin: true,
      } as never);

      // Act
      const result = await authService.authUser(AuthMode.SignIn, {
        email: "admin@example.com",
        password: "admin-secret",
      });

      // Assert
      expect(userService.setIsAdmin).toHaveBeenCalledWith("admin-1", true);
      expect(result?.isAdmin).toBe(true);
    });

    it("returns null for wrong non-admin credentials", async () => {
      // Arrange
      vi.mocked(userService.getUser).mockResolvedValue(null);

      // Act
      const result = await authService.authUser(AuthMode.SignIn, {
        email: "user@example.com",
        password: "wrong",
      });

      // Assert
      expect(result).toBeNull();
      expect(userService.findByEmail).not.toHaveBeenCalled();
    });

    it("returns null when admin env password matches but user already exists", async () => {
      // Arrange
      vi.mocked(userService.getUser).mockResolvedValue(null);
      vi.mocked(userService.findByEmail).mockResolvedValue({
        id: "existing-admin",
      } as never);

      // Act
      const result = await authService.authUser(AuthMode.SignIn, {
        email: "admin@example.com",
        password: "admin-secret",
      });

      // Assert
      expect(result).toBeNull();
      expect(userService.createUser).not.toHaveBeenCalled();
      expect(setTestAppData).not.toHaveBeenCalled();
    });

    it("bootstraps admin user and seeds data on first admin login", async () => {
      // Arrange
      vi.mocked(userService.getUser).mockResolvedValue(null);
      vi.mocked(userService.findByEmail).mockResolvedValue(null);
      vi.mocked(userService.createUser).mockResolvedValue({
        id: "admin-1",
        email: "admin@example.com",
        name: "admin",
        isAdmin: true,
      } as never);
      vi.mocked(setTestAppData).mockResolvedValue(undefined as never);

      // Act
      const result = await authService.authUser(AuthMode.SignIn, {
        email: "admin@example.com",
        password: "admin-secret",
      });

      // Assert
      expect(userService.createUser).toHaveBeenCalledWith(
        "admin@example.com",
        "admin-secret",
        "admin",
        { isAdmin: true },
      );
      expect(setTestAppData).toHaveBeenCalledWith("admin-1");
      expect(result).toEqual({
        id: "admin-1",
        email: "admin@example.com",
        name: "admin",
        isAdmin: true,
      });
    });
  });

  describe("getAuthenticatedSession", () => {
    it("returns the session when the user id is present", async () => {
      // Arrange
      const session = { user: { id: "user-1" } } as Session;
      vi.mocked(auth).mockResolvedValue(session as never);

      // Act
      const result = await authService.getAuthenticatedSession();

      // Assert
      expect(result).toBe(session);
    });

    it("throws Unauthorized when there is no session user", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue(null as never);

      // Act & Assert
      await expect(
        authService.getAuthenticatedSession(),
      ).rejects.toBeInstanceOf(CustomError);
    });
  });

  describe("getSessionOrRedirectToLoginPage", () => {
    it("returns the session when authenticated", async () => {
      // Arrange
      const session = { user: { id: "user-1" } } as Session;
      vi.mocked(auth).mockResolvedValue(session as never);

      // Act
      const result = await authService.getSessionOrRedirectToLoginPage();

      // Assert
      expect(result).toBe(session);
      expect(redirect).not.toHaveBeenCalled();
    });

    it("redirects to login when unauthenticated", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue(null as never);

      // Act
      await authService.getSessionOrRedirectToLoginPage();

      // Assert
      expect(redirect).toHaveBeenCalledWith(constants.AppRoutes.login);
    });
  });
});
