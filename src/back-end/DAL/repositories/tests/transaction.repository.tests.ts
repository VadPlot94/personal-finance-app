import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const { transactionModel, budgetModel } = vi.hoisted(() => ({
  transactionModel: {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    deleteMany: vi.fn(),
  },
  budgetModel: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/back-end/prisma/prisma-client", () => ({
  default: {
    transaction: transactionModel,
    budget: budgetModel,
  },
}));

import { TransactionRepository } from "@/back-end/DAL/repositories/transaction.repository";

describe("TransactionRepository", () => {
  let repository: TransactionRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new TransactionRepository();
  });

  describe("getAllTransactions", () => {
    it("queries page slice and total count for the user", async () => {
      // Arrange
      transactionModel.findMany.mockResolvedValue([{ id: "tx-1" }]);
      transactionModel.count.mockResolvedValue(1);

      // Act
      const result = await repository.getAllTransactions({
        page: 2,
        transactionsCount: 5,
        sortBy: "date",
        order: "desc",
        userId: "user-1",
        isRecurring: false,
        search: " net ",
        category: "Bills",
      } as never);

      // Assert
      expect(transactionModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
          where: expect.objectContaining({
            userId: "user-1",
            category: "Bills",
            name: expect.objectContaining({ contains: "net" }),
          }),
        }),
      );
      expect(result.paginationData.allTransactionsCount).toBe(1);
      expect(result.transactions).toHaveLength(1);
    });
  });

  describe("getMonthlyExpensesByCategory", () => {
    it("returns an empty list when the user has no budgets", async () => {
      // Arrange
      budgetModel.findMany.mockResolvedValue([]);

      // Act
      const result = await repository.getMonthlyExpensesByCategory("user-1");

      // Assert
      expect(result).toEqual([]);
      expect(transactionModel.findMany).not.toHaveBeenCalled();
    });

    it("loads expenses only for budget categories", async () => {
      // Arrange
      budgetModel.findMany.mockResolvedValue([{ category: "Bills" }]);
      transactionModel.findMany.mockResolvedValue([{ id: "tx-1" }]);

      // Act
      const result = await repository.getMonthlyExpensesByCategory("user-1");

      // Assert
      expect(transactionModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: "user-1",
            category: { in: ["Bills"] },
            amount: { lt: 0 },
          }),
        }),
      );
      expect(result).toEqual([{ id: "tx-1" }]);
    });
  });

  describe("deleteIfOwnedRecurring", () => {
    it("returns true when a recurring owned row is deleted", async () => {
      // Arrange
      transactionModel.deleteMany.mockResolvedValue({ count: 1 });

      // Act
      const result = await repository.deleteIfOwnedRecurring("tx-1", "user-1");

      // Assert
      expect(transactionModel.deleteMany).toHaveBeenCalledWith({
        where: { id: "tx-1", userId: "user-1", recurring: true },
      });
      expect(result).toBe(true);
    });

    it("returns false when nothing was deleted", async () => {
      // Arrange
      transactionModel.deleteMany.mockResolvedValue({ count: 0 });

      // Act
      const result = await repository.deleteIfOwnedRecurring("tx-1", "user-1");

      // Assert
      expect(result).toBe(false);
    });
  });
});
