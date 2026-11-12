import type { Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/back-end/lib/test-utils/next-cache.mock";
import "@/shared/lib/test-utils/logger.service.mock";

vi.mock("@/back-end/DAL/db-services/auth.service", () => ({
  default: {
    getAuthenticatedSession: vi.fn(),
  },
}));

vi.mock("@/back-end/DAL/db-services/recurring-db.service", () => ({
  default: {
    materializeDueBills: vi.fn(),
  },
}));

vi.mock("@/back-end/DAL/db-services/transaction-db.service", () => ({
  default: {
    getAllTransactions: vi.fn(),
    getRecurringExpenses: vi.fn(),
    deleteRecurring: vi.fn(),
  },
}));

vi.mock("@/back-end/DAL/db-services/balance-db.service", () => ({
  default: {
    recalculateBalance: vi.fn(),
  },
}));

import { updateTag } from "next/cache";
import recurringController from "@/back-end/controllers/recurring-controller";
import { balanceTag } from "@/back-end/DAL/cache/cache-tags";
import authService from "@/back-end/DAL/db-services/auth.service";
import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import recurringDbService from "@/back-end/DAL/db-services/recurring-db.service";
import transactionDbService from "@/back-end/DAL/db-services/transaction-db.service";

describe("RecurringController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.getAuthenticatedSession).mockResolvedValue({
      user: { id: "user-1" },
    } as Session);
    vi.mocked(recurringDbService.materializeDueBills).mockResolvedValue(0);
  });

  describe("getAllRecurring", () => {
    it("materializes due bills then loads recurring transactions", async () => {
      // Arrange
      const response = {
        transactions: [],
        paginationData: {
          allTransactionsCount: 0,
          page: 1,
          transactionsCount: 5,
        },
      };
      vi.mocked(transactionDbService.getAllTransactions).mockResolvedValue(
        response,
      );

      // Act
      const result = await recurringController.getAllRecurring({ page: 1 });

      // Assert
      expect(recurringDbService.materializeDueBills).toHaveBeenCalledWith(
        "user-1",
      );
      expect(transactionDbService.getAllTransactions).toHaveBeenCalledWith(
        { page: 1, isRecurring: true },
        "user-1",
      );
      expect(result.data).toEqual(response);
    });
  });

  describe("getRecurringExpenses", () => {
    it("materializes due bills then returns recurring expenses", async () => {
      // Arrange
      const expenses = [{ id: "tx-1" }];
      vi.mocked(transactionDbService.getRecurringExpenses).mockResolvedValue(
        expenses as never,
      );

      // Act
      const result = await recurringController.getRecurringExpenses();

      // Assert
      expect(transactionDbService.getRecurringExpenses).toHaveBeenCalledWith(
        "user-1",
      );
      expect(result.data).toEqual(expenses);
    });
  });

  describe("deleteRecurring", () => {
    it("deletes a recurring bill, recalculates balance, and syncs cache", async () => {
      // Arrange
      vi.mocked(transactionDbService.deleteRecurring).mockResolvedValue(true);
      vi.mocked(balanceDbService.recalculateBalance).mockResolvedValue(
        {} as never,
      );

      // Act
      const result = await recurringController.deleteRecurring("tx-1");

      // Assert
      expect(transactionDbService.deleteRecurring).toHaveBeenCalledWith(
        "tx-1",
        "user-1",
      );
      expect(balanceDbService.recalculateBalance).toHaveBeenCalledWith(
        "user-1",
      );
      expect(updateTag).toHaveBeenCalledWith(balanceTag("user-1"));
      expect(result.data).toBe(true);
    });
  });
});
