import type { Transaction } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";

vi.mock("@/back-end/DAL/repositories/transaction.repository", () => ({
  transactionRepository: {
    getRecurringExpenses: vi.fn(),
    createTransaction: vi.fn(),
  },
}));

vi.mock("@/back-end/DAL/db-services/balance-db.service", () => ({
  default: {
    recalculateBalance: vi.fn(),
  },
}));

import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import recurringDbService from "@/back-end/DAL/db-services/recurring-db.service";
import { transactionRepository } from "@/back-end/DAL/repositories/transaction.repository";

function createExpense(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "tx-1",
    userId: "user-1",
    name: "Netflix",
    avatar: "./avatar.jpg",
    amount: -15,
    category: "Bills",
    date: new Date(2026, 0, 5),
    recurring: true,
    ...overrides,
  } as Transaction;
}

describe("RecurringDbService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(transactionRepository.createTransaction).mockResolvedValue(
      {} as Transaction,
    );
    vi.mocked(balanceDbService.recalculateBalance).mockResolvedValue(
      undefined as never,
    );
  });

  describe("materializeDueBills", () => {
    it("posts a due template that is not yet posted this month", async () => {
      // Arrange
      const today = new Date(2026, 1, 10);
      vi.mocked(transactionRepository.getRecurringExpenses).mockResolvedValue([
        createExpense({
          id: "template",
          date: new Date(2026, 0, 5),
        }),
      ]);

      // Act
      const result = await recurringDbService.materializeDueBills(
        "user-1",
        today,
      );

      // Assert
      expect(result).toBe(1);
      expect(transactionRepository.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-1",
          name: "Netflix",
          amount: -15,
          recurring: true,
          date: new Date(2026, 1, 5),
        }),
      );
      expect(balanceDbService.recalculateBalance).toHaveBeenCalledWith(
        "user-1",
      );
    });

    it("skips templates already posted in the current month", async () => {
      // Arrange
      const today = new Date(2026, 1, 10);
      vi.mocked(transactionRepository.getRecurringExpenses).mockResolvedValue([
        createExpense({
          id: "older",
          date: new Date(2026, 0, 5),
        }),
        createExpense({
          id: "already-posted",
          date: new Date(2026, 1, 5),
        }),
      ]);

      // Act
      const result = await recurringDbService.materializeDueBills(
        "user-1",
        today,
      );

      // Assert
      expect(result).toBe(0);
      expect(transactionRepository.createTransaction).not.toHaveBeenCalled();
      expect(balanceDbService.recalculateBalance).not.toHaveBeenCalled();
    });

    it("does not post a bill before its due day", async () => {
      // Arrange
      const today = new Date(2026, 1, 3);
      vi.mocked(transactionRepository.getRecurringExpenses).mockResolvedValue([
        createExpense({
          id: "template",
          date: new Date(2026, 0, 10),
        }),
      ]);

      // Act
      const result = await recurringDbService.materializeDueBills(
        "user-1",
        today,
      );

      // Assert
      expect(result).toBe(0);
      expect(transactionRepository.createTransaction).not.toHaveBeenCalled();
    });

    it("reuses the in-flight promise for the same user", async () => {
      // Arrange
      const today = new Date(2026, 1, 10);
      let resolveExpenses!: (value: Transaction[]) => void;
      const expensesPromise = new Promise<Transaction[]>((resolve) => {
        resolveExpenses = resolve;
      });
      vi.mocked(transactionRepository.getRecurringExpenses).mockReturnValue(
        expensesPromise,
      );

      // Act
      const first = recurringDbService.materializeDueBills("user-1", today);
      const second = recurringDbService.materializeDueBills("user-1", today);
      resolveExpenses([
        createExpense({
          id: "template",
          date: new Date(2026, 0, 5),
        }),
      ]);
      const [firstResult, secondResult] = await Promise.all([first, second]);

      // Assert
      expect(firstResult).toBe(1);
      expect(secondResult).toBe(1);
      expect(transactionRepository.getRecurringExpenses).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
