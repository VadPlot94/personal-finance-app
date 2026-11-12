import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const { budgetModel } = vi.hoisted(() => ({
  budgetModel: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    upsert: vi.fn(),
    aggregate: vi.fn(),
  },
}));

vi.mock("@/back-end/prisma/prisma-client", () => ({
  default: {
    budget: budgetModel,
  },
}));

import { BudgetRepository } from "@/back-end/DAL/repositories/budget.repository";

describe("BudgetRepository", () => {
  let repository: BudgetRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new BudgetRepository();
  });

  describe("getAll", () => {
    it("returns budgets ordered by category", async () => {
      // Arrange
      const budgets = [{ id: "b-1" }];
      budgetModel.findMany.mockResolvedValue(budgets);

      // Act
      const result = await repository.getAll("user-1");

      // Assert
      expect(budgetModel.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { category: "asc" },
      });
      expect(result).toEqual(budgets);
    });
  });

  describe("getByCategory", () => {
    it("finds a budget by category and user", async () => {
      // Arrange
      budgetModel.findFirst.mockResolvedValue({ id: "b-1" });

      // Act
      const result = await repository.getByCategory("Bills", "user-1");

      // Assert
      expect(result).toEqual({ id: "b-1" });
    });
  });

  describe("getTotalMaximum", () => {
    it("sums maximum values", async () => {
      // Arrange
      budgetModel.aggregate.mockResolvedValue({
        _sum: { maximum: 300 },
      });

      // Act
      const result = await repository.getTotalMaximum();

      // Assert
      expect(result).toBe(300);
    });
  });
});
