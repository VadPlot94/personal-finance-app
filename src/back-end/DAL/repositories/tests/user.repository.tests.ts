import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const { userModel } = vi.hoisted(() => ({
  userModel: {
    findUnique: vi.fn(),
    create: vi.fn(),
    upsert: vi.fn(),
  },
}));

vi.mock("@/back-end/prisma/prisma-client", () => ({
  default: {
    user: userModel,
  },
}));

import { UserRepository } from "@/back-end/DAL/repositories/user.repository";

describe("UserRepository", () => {
  let repository: UserRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new UserRepository();
  });

  describe("findByEmail", () => {
    it("finds a user by email", async () => {
      // Arrange
      userModel.findUnique.mockResolvedValue({ id: "user-1" });

      // Act
      const result = await repository.findByEmail("user@example.com", {
        id: true,
      });

      // Assert
      expect(userModel.findUnique).toHaveBeenCalledWith({
        where: { email: "user@example.com" },
        select: { id: true },
      });
      expect(result).toEqual({ id: "user-1" });
    });
  });

  describe("createUser", () => {
    it("creates a user record", async () => {
      // Arrange
      userModel.create.mockResolvedValue({ id: "user-1" });

      // Act
      const result = await repository.createUser({
        email: "user@example.com",
        name: "Vad",
        hashedPassword: "hash",
      });

      // Assert
      expect(userModel.create).toHaveBeenCalledWith({
        data: {
          email: "user@example.com",
          name: "Vad",
          hashedPassword: "hash",
        },
        select: undefined,
      });
      expect(result).toEqual({ id: "user-1" });
    });
  });
});
