import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/shared/lib/test-utils/logger.service.mock";
import { CustomError } from "@/back-end/common/errors";
import {
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";

vi.mock("@/back-end/DAL/repositories/transaction.repository", () => ({
  transactionRepository: {
    getAllTransactions: vi.fn(),
    getRecurringExpenses: vi.fn(),
    getMonthlyExpensesByCategory: vi.fn(),
    createTransaction: vi.fn(),
    deleteIfOwnedRecurring: vi.fn(),
  },
}));

vi.mock("@/back-end/mappers/transaction-mapper", () => ({
  default: {
    mapGetTransactionsInputToDBTransactionsParams: vi.fn(),
    mapGetTransactionsToOutput: vi.fn(),
    mapMonthlyExpensesByCategoryToOutput: vi.fn(),
    mapCreateTransactionInputToDBTransaction: vi.fn(),
    mapCreateDBTransactionToOutput: vi.fn(),
    mapGetTransactionsForCategoryInputToParams: vi.fn(),
    mapGetTransactionsForCategoryToOutput: vi.fn(),
  },
}));

vi.mock("@/shared/services/validation.service", () => ({
  default: {
    validateCreateTransactionSchema: vi.fn(),
    createCustomZodIssueResult: vi.fn(),
    createErrorsWithPath: vi.fn(() => ({ field: "required" })),
  },
}));

import transactionDbService from "@/back-end/DAL/db-services/transaction-db.service";
import { transactionRepository } from "@/back-end/DAL/repositories/transaction.repository";
import transactionMapper from "@/back-end/mappers/transaction-mapper";
import validationService from "@/shared/services/validation.service";

describe("TransactionDbService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllTransactions", () => {
    it("maps input params and repository response", async () => {
      // Arrange
      const mappedParams = {
        page: 1,
        transactionsCount: 5,
        sortBy: "date",
        order: "desc",
        isRecurring: false,
      };
      const repoResponse = {
        transactions: [],
        paginationData: {
          allTransactionsCount: 0,
          page: 1,
          transactionsCount: 5,
        },
      };
      vi.mocked(
        transactionMapper.mapGetTransactionsInputToDBTransactionsParams,
      ).mockReturnValue(mappedParams as never);
      vi.mocked(transactionRepository.getAllTransactions).mockResolvedValue(
        repoResponse,
      );
      vi.mocked(transactionMapper.mapGetTransactionsToOutput).mockReturnValue(
        repoResponse,
      );

      // Act
      const result = await transactionDbService.getAllTransactions(
        { page: 1 },
        "user-1",
      );

      // Assert
      expect(transactionRepository.getAllTransactions).toHaveBeenCalledWith({
        ...mappedParams,
        userId: "user-1",
      });
      expect(result).toEqual(repoResponse);
    });
  });

  describe("getRecurringExpenses", () => {
    it("returns repository recurring expenses", async () => {
      // Arrange
      const expenses = [{ id: "tx-1" }];
      vi.mocked(transactionRepository.getRecurringExpenses).mockResolvedValue(
        expenses as never,
      );

      // Act
      const result = await transactionDbService.getRecurringExpenses("user-1");

      // Assert
      expect(result).toEqual(expenses);
    });
  });

  describe("getMonthlyExpensesByCategory", () => {
    it("maps repository expenses by category", async () => {
      // Arrange
      const expenses = [{ id: "tx-1", category: "Bills" }];
      const mapped = [{ category: "Bills", transactions: expenses }];
      vi.mocked(
        transactionRepository.getMonthlyExpensesByCategory,
      ).mockResolvedValue(expenses as never);
      vi.mocked(
        transactionMapper.mapMonthlyExpensesByCategoryToOutput,
      ).mockReturnValue(mapped as never);

      // Act
      const result =
        await transactionDbService.getMonthlyExpensesByCategory("user-1");

      // Assert
      expect(result).toEqual(mapped);
    });
  });

  describe("createTransaction", () => {
    it("validates form data before creating", async () => {
      // Arrange
      const formData = new FormData();
      formData.set("transactionType", TransactionType.Expense);
      formData.set("category", TransactionUICategory.Bills);
      formData.set("recipientOrSender", "Netflix");
      formData.set("amount", "25");
      formData.set("date", "2024-06-01");
      vi.mocked(
        validationService.validateCreateTransactionSchema,
      ).mockReturnValue({ success: true, data: {} } as never);
      vi.mocked(
        transactionMapper.mapCreateTransactionInputToDBTransaction,
      ).mockReturnValue({
        amount: -25,
        name: "Netflix",
        category: TransactionUICategory.Bills,
      });
      vi.mocked(transactionRepository.createTransaction).mockResolvedValue({
        id: "tx-1",
      } as never);
      vi.mocked(
        transactionMapper.mapCreateDBTransactionToOutput,
      ).mockReturnValue({ id: "tx-1" });

      // Act
      const result = await transactionDbService.createTransaction(
        formData,
        "user-1",
      );

      // Assert
      expect(result).toEqual({ id: "tx-1" });
    });

    it("throws when form validation fails", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(
        validationService.validateCreateTransactionSchema,
      ).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["amount"], message: "invalid" }] },
      } as never);

      // Act & Assert
      await expect(
        transactionDbService.createTransaction(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });
  });

  describe("deleteRecurring", () => {
    it("throws when id is missing", async () => {
      // Arrange
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["id"], message: "required" }] },
      } as never);

      // Act & Assert
      await expect(
        transactionDbService.deleteRecurring(undefined, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("returns true when an owned recurring row is deleted", async () => {
      // Arrange
      vi.mocked(transactionRepository.deleteIfOwnedRecurring).mockResolvedValue(
        true,
      );

      // Act
      const result = await transactionDbService.deleteRecurring(
        "tx-1",
        "user-1",
      );

      // Assert
      expect(result).toBe(true);
    });

    it("throws when the recurring row is not found", async () => {
      // Arrange
      vi.mocked(transactionRepository.deleteIfOwnedRecurring).mockResolvedValue(
        false,
      );
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["id"], message: "not found" }] },
      } as never);

      // Act & Assert
      await expect(
        transactionDbService.deleteRecurring("tx-1", "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });
  });

  describe("getTransactionsForCategory", () => {
    it("returns an empty list when categories are empty", async () => {
      // Arrange
      vi.mocked(
        transactionMapper.mapGetTransactionsForCategoryInputToParams,
      ).mockReturnValue({ categories: [], transactionsCount: 3 });

      // Act
      const result = await transactionDbService.getTransactionsForCategory(
        {},
        "user-1",
      );

      // Assert
      expect(result).toEqual([]);
    });

    it("throws when transactionsCount is not positive", async () => {
      // Arrange
      vi.mocked(
        transactionMapper.mapGetTransactionsForCategoryInputToParams,
      ).mockReturnValue({
        categories: [TransactionUICategory.Bills],
        transactionsCount: 0,
      });
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: {
          issues: [{ path: ["transactionsCount"], message: "positive" }],
        },
      } as never);

      // Act & Assert
      await expect(
        transactionDbService.getTransactionsForCategory({}, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("loads transactions for each category", async () => {
      // Arrange
      vi.mocked(
        transactionMapper.mapGetTransactionsForCategoryInputToParams,
      ).mockReturnValue({
        categories: [TransactionUICategory.Bills],
        transactionsCount: 3,
      });
      vi.mocked(
        transactionMapper.mapGetTransactionsInputToDBTransactionsParams,
      ).mockReturnValue({
        page: 1,
        transactionsCount: 3,
        sortBy: "date",
        order: "desc",
        isRecurring: false,
      } as never);
      vi.mocked(transactionRepository.getAllTransactions).mockResolvedValue({
        transactions: [{ id: "tx-1" }],
        paginationData: {
          allTransactionsCount: 1,
          page: 1,
          transactionsCount: 3,
        },
      } as never);
      vi.mocked(transactionMapper.mapGetTransactionsToOutput).mockImplementation(
        (response) => response,
      );
      vi.mocked(
        transactionMapper.mapGetTransactionsForCategoryToOutput,
      ).mockImplementation((items) => items);

      // Act
      const result = await transactionDbService.getTransactionsForCategory(
        { categories: [TransactionUICategory.Bills] },
        "user-1",
      );

      // Assert
      expect(result).toEqual([
        {
          category: TransactionUICategory.Bills,
          transactions: [{ id: "tx-1" }],
        },
      ]);
    });
  });
});
