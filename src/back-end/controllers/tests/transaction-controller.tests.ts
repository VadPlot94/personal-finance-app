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

vi.mock("@/back-end/DAL/db-services/transaction-db.service", () => ({
  default: {
    createTransaction: vi.fn(),
    getAllTransactions: vi.fn(),
    getMonthlyExpensesByCategory: vi.fn(),
    getTransactionsForCategory: vi.fn(),
  },
}));

vi.mock("@/back-end/DAL/db-services/balance-db.service", () => ({
  default: {
    recalculateBalance: vi.fn(),
  },
}));

import { updateTag } from "next/cache";
import transactionController from "@/back-end/controllers/transaction-controller";
import { balanceTag } from "@/back-end/DAL/cache/cache-tags";
import authService from "@/back-end/DAL/db-services/auth.service";
import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import transactionDbService from "@/back-end/DAL/db-services/transaction-db.service";
import { TransactionUICategory } from "@/shared/services/constants.service";

describe("TransactionController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.getAuthenticatedSession).mockResolvedValue({
      user: { id: "user-1" },
    } as Session);
  });

  describe("createTransaction", () => {
    it("creates a transaction, recalculates balance, and syncs cache", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(transactionDbService.createTransaction).mockResolvedValue({
        id: "tx-1",
      });
      vi.mocked(balanceDbService.recalculateBalance).mockResolvedValue(
        {} as never,
      );

      // Act
      const result = await transactionController.createTransaction(
        null,
        formData,
      );

      // Assert
      expect(transactionDbService.createTransaction).toHaveBeenCalledWith(
        formData,
        "user-1",
      );
      expect(balanceDbService.recalculateBalance).toHaveBeenCalledWith(
        "user-1",
      );
      expect(updateTag).toHaveBeenCalledWith(balanceTag("user-1"));
      expect(result.data).toEqual({ id: "tx-1" });
    });
  });

  describe("getAllTransactions", () => {
    it("forwards query params to the db service", async () => {
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
      const result = await transactionController.getAllTransactions({
        page: 2,
      });

      // Assert
      expect(transactionDbService.getAllTransactions).toHaveBeenCalledWith(
        { page: 2 },
        "user-1",
      );
      expect(result.data).toEqual(response);
    });
  });

  describe("getTransactionsMonthlyExpensesByCategory", () => {
    it("returns monthly expenses from the db service", async () => {
      // Arrange
      const expenses = [{ category: "Bills", transactions: [] }];
      vi.mocked(
        transactionDbService.getMonthlyExpensesByCategory,
      ).mockResolvedValue(expenses as never);

      // Act
      const result =
        await transactionController.getTransactionsMonthlyExpensesByCategory();

      // Assert
      expect(
        transactionDbService.getMonthlyExpensesByCategory,
      ).toHaveBeenCalledWith("user-1");
      expect(result.data).toEqual(expenses);
    });
  });

  describe("getTransactionsForCategory", () => {
    it("returns category transactions from the db service", async () => {
      // Arrange
      const items = [
        { category: TransactionUICategory.Bills, transactions: [] },
      ];
      vi.mocked(
        transactionDbService.getTransactionsForCategory,
      ).mockResolvedValue(items as never);

      // Act
      const result = await transactionController.getTransactionsForCategory({
        categories: [TransactionUICategory.Bills],
      });

      // Assert
      expect(
        transactionDbService.getTransactionsForCategory,
      ).toHaveBeenCalledWith(
        { categories: [TransactionUICategory.Bills] },
        "user-1",
      );
      expect(result.data).toEqual(items);
    });
  });
});
