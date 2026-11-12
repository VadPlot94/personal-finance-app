import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

const { balanceModel } = vi.hoisted(() => ({
  balanceModel: {
    findFirst: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
    aggregate: vi.fn(),
  },
}));

vi.mock("@/back-end/prisma/prisma-client", () => ({
  default: {
    balance: balanceModel,
  },
}));

import { BalanceRepository } from "@/back-end/DAL/repositories/balance.repository";

describe("BalanceRepository", () => {
  let repository: BalanceRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new BalanceRepository();
  });

  describe("getCurrent", () => {
    it("finds the latest balance for the user", async () => {
      // Arrange
      const balance = { id: "bal-1", userId: "user-1" };
      balanceModel.findFirst.mockResolvedValue(balance);

      // Act
      const result = await repository.getCurrent("user-1");

      // Assert
      expect(balanceModel.findFirst).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { updatedAt: "desc" },
      });
      expect(result).toEqual(balance);
    });
  });

  describe("upsertBalance", () => {
    it("upserts by userId", async () => {
      // Arrange
      const upserted = { id: "bal-1", current: 10, income: 20, expenses: 10 };
      balanceModel.upsert.mockResolvedValue(upserted);

      // Act
      const result = await repository.upsertBalance({
        userId: "user-1",
        current: 10,
        income: 20,
        expenses: 10,
      });

      // Assert
      expect(balanceModel.upsert).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        update: { current: 10, income: 20, expenses: 10 },
        create: {
          id: undefined,
          userId: "user-1",
          current: 10,
          income: 20,
          expenses: 10,
        },
      });
      expect(result).toEqual(upserted);
    });
  });

  describe("getSummary", () => {
    it("aggregates current income and expenses", async () => {
      // Arrange
      balanceModel.aggregate.mockResolvedValue({
        _sum: { current: 5, income: 10, expenses: 5 },
      });

      // Act
      const result = await repository.getSummary("user-1");

      // Assert
      expect(result).toEqual({
        current: 5,
        totalIncome: 10,
        totalExpenses: 5,
      });
    });
  });
});
