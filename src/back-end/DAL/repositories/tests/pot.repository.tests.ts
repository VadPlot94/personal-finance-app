import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const { potModel } = vi.hoisted(() => ({
  potModel: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    updateMany: vi.fn(),
  },
}));

vi.mock("@/back-end/prisma/prisma-client", () => ({
  default: {
    pot: potModel,
  },
}));

import { PotRepository } from "@/back-end/DAL/repositories/pot.repository";

describe("PotRepository", () => {
  let repository: PotRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PotRepository();
  });

  describe("getAll", () => {
    it("returns pots ordered by name", async () => {
      // Arrange
      const pots = [{ id: "pot-1", name: "A" }];
      potModel.findMany.mockResolvedValue(pots);

      // Act
      const result = await repository.getAll("user-1");

      // Assert
      expect(potModel.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { name: "asc" },
      });
      expect(result).toEqual(pots);
    });
  });

  describe("createPot", () => {
    it("creates a pot with default total 0", async () => {
      // Arrange
      potModel.create.mockResolvedValue({ id: "pot-1" });

      // Act
      const result = await repository.createPot({
        name: "Vacation",
        target: 100,
        theme: "#000",
        userId: "user-1",
      });

      // Assert
      expect(potModel.create).toHaveBeenCalledWith({
        data: {
          name: "Vacation",
          target: 100,
          total: 0,
          theme: "#000",
          userId: "user-1",
        },
        select: undefined,
      });
      expect(result).toEqual({ id: "pot-1" });
    });
  });

  describe("getProgress", () => {
    it("computes progress percentage per pot", async () => {
      // Arrange
      potModel.findMany.mockResolvedValue([
        { name: "A", target: 100, total: 25 },
        { name: "B", target: 0, total: 10 },
      ]);

      // Act
      const result = await repository.getProgress("user-1");

      // Assert
      expect(result).toEqual([
        { name: "A", target: 100, total: 25, progress: 25 },
        { name: "B", target: 0, total: 10, progress: 0 },
      ]);
    });
  });
});
