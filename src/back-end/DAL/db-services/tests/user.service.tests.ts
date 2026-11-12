import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import { CustomError } from "@/back-end/common/errors";

vi.mock("@/back-end/DAL/db-services/crypto.service", () => ({
  default: {
    hashPassword: vi.fn(),
    verifyPassword: vi.fn(),
  },
}));

vi.mock("@/back-end/DAL/repositories/user.repository", () => ({
  userRepository: {
    findByEmail: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import cryptoService from "@/back-end/DAL/db-services/crypto.service";
import userService from "@/back-end/DAL/db-services/user.service";
import { userRepository } from "@/back-end/DAL/repositories/user.repository";
import { auth } from "@/lib/auth";

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUser", () => {
    it("returns null when the user has no password hash", async () => {
      // Arrange
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: "user-1",
        hashedPassword: null,
      } as never);

      // Act
      const result = await userService.getUser("user@example.com", "secret");

      // Assert
      expect(result).toBeNull();
    });

    it("returns null when the password does not match", async () => {
      // Arrange
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: "user-1",
        hashedPassword: "hash",
      } as never);
      vi.mocked(cryptoService.verifyPassword).mockResolvedValue(false);

      // Act
      const result = await userService.getUser("user@example.com", "wrong");

      // Assert
      expect(result).toBeNull();
    });

    it("returns the user when the password matches", async () => {
      // Arrange
      const user = {
        id: "user-1",
        email: "user@example.com",
        hashedPassword: "hash",
      };
      vi.mocked(userRepository.findByEmail).mockResolvedValue(user as never);
      vi.mocked(cryptoService.verifyPassword).mockResolvedValue(true);

      // Act
      const result = await userService.getUser("user@example.com", "secret");

      // Assert
      expect(result).toEqual(user);
    });
  });

  describe("findByEmail", () => {
    it("delegates to the user repository", async () => {
      // Arrange
      vi.mocked(userRepository.findByEmail).mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
      } as never);

      // Act
      const result = await userService.findByEmail("user@example.com");

      // Assert
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        "user@example.com",
        {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      );
      expect(result?.id).toBe("user-1");
    });
  });

  describe("setIsAdmin", () => {
    it("updates the admin flag through the repository", async () => {
      // Arrange
      vi.mocked(userRepository.update).mockResolvedValue({
        id: "user-1",
        isAdmin: true,
      } as never);

      // Act
      const result = await userService.setIsAdmin("user-1", true);

      // Assert
      expect(userRepository.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: { isAdmin: true },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      });
      expect(result.isAdmin).toBe(true);
    });
  });

  describe("createUser", () => {
    it("hashes the password before creating the user", async () => {
      // Arrange
      vi.mocked(cryptoService.hashPassword).mockResolvedValue("hashed");
      vi.mocked(userRepository.create).mockResolvedValue({
        id: "user-1",
        email: "user@example.com",
        name: "Vad",
        isAdmin: false,
      } as never);

      // Act
      const result = await userService.createUser(
        "user@example.com",
        "secret1",
        "Vad",
      );

      // Assert
      expect(cryptoService.hashPassword).toHaveBeenCalledWith("secret1");
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            hashedPassword: "hashed",
            isAdmin: false,
          }),
        }),
      );
      expect(result.id).toBe("user-1");
    });
  });

  describe("getAuthenticatedSession", () => {
    it("throws Unauthorized when session user is missing", async () => {
      // Arrange
      vi.mocked(auth).mockResolvedValue(null as never);

      // Act & Assert
      await expect(userService.getAuthenticatedSession()).rejects.toBeInstanceOf(
        CustomError,
      );
    });

    it("returns the session when authenticated", async () => {
      // Arrange
      const session = { user: { id: "user-1" } } as Session;
      vi.mocked(auth).mockResolvedValue(session as never);

      // Act
      const result = await userService.getAuthenticatedSession();

      // Assert
      expect(result).toBe(session);
    });
  });
});
