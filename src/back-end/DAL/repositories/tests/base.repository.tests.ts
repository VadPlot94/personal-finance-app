import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import { BaseRepository } from "@/back-end/DAL/repositories/base.repository";

class TestRepository extends BaseRepository<"user"> {
  public constructor(model: unknown) {
    super(model as never);
  }
}

describe("BaseRepository", () => {
  const model = {
    create: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    updateMany: vi.fn(),
    deleteMany: vi.fn(),
    upsert: vi.fn(),
    count: vi.fn(),
  };

  let repository: TestRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new TestRepository(model);
  });

  describe("isUnique", () => {
    it("returns true when no conflicting row exists", async () => {
      // Arrange
      model.findFirst.mockResolvedValue(null);

      // Act
      const result = await repository.isUnique("email", "a@b.com", "user-1");

      // Assert
      expect(result).toBe(true);
    });

    it("returns false when another row already uses the value", async () => {
      // Arrange
      model.findFirst.mockResolvedValue({ id: "other" });

      // Act
      const result = await repository.isUnique(
        "email",
        "a@b.com",
        "user-1",
        "current",
      );

      // Assert
      expect(model.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            email: "a@b.com",
            userId: "user-1",
            id: { not: "current" },
          }),
        }),
      );
      expect(result).toBe(false);
    });
  });

  describe("updateOwned", () => {
    it("returns null when no owned rows were updated", async () => {
      // Arrange
      model.updateMany.mockResolvedValue({ count: 0 });

      // Act
      const result = await repository.updateOwned({
        where: { id: "1", userId: "user-1" },
        data: { name: "x" },
      });

      // Assert
      expect(result).toBeNull();
    });

    it("returns the updated row when updateMany affects rows", async () => {
      // Arrange
      model.updateMany.mockResolvedValue({ count: 1 });
      model.findFirst.mockResolvedValue({ id: "1", name: "x" });

      // Act
      const result = await repository.updateOwned({
        where: { id: "1", userId: "user-1" },
        data: { name: "x" },
        select: { id: true },
      });

      // Assert
      expect(result).toEqual({ id: "1", name: "x" });
    });
  });

  describe("deleteOwned", () => {
    it("returns the deleted row count", async () => {
      // Arrange
      model.deleteMany.mockResolvedValue({ count: 2 });

      // Act
      const result = await repository.deleteOwned({
        where: { userId: "user-1" },
      });

      // Assert
      expect(result).toBe(2);
    });
  });

  describe("ensureDataOwnership", () => {
    it("returns true when the owned row exists", async () => {
      // Arrange
      model.findFirst.mockResolvedValue({ id: "1" });

      // Act
      const result = await repository.ensureDataOwnership("1", "user-1");

      // Assert
      expect(result).toBe(true);
    });

    it("returns false when the owned row does not exist", async () => {
      // Arrange
      model.findFirst.mockResolvedValue(null);

      // Act
      const result = await repository.ensureDataOwnership("1", "user-1");

      // Assert
      expect(result).toBe(false);
    });
  });
});
