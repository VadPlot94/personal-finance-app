import type { Transaction } from "@prisma/client";
import { describe, expect, it } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import transactionMapper from "@/back-end/mappers/transaction-mapper";
import constants, {
  SortBy,
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";

describe("TransactionMapper", () => {
  describe("mapCreateTransactionInputToDBTransaction", () => {
    it("maps an expense amount as negative", () => {
      // Arrange
      const formData = new FormData();
      formData.set("amount", "1 250");
      formData.set("transactionType", TransactionType.Expense);
      formData.set("category", TransactionUICategory.Bills);
      formData.set("recipientOrSender", "Netflix");
      formData.set("date", "2024-06-01");
      formData.set("recurring", "true");

      // Act
      const result =
        transactionMapper.mapCreateTransactionInputToDBTransaction(formData);

      // Assert
      expect(result?.amount).toBe(-1250);
      expect(result?.name).toBe("Netflix");
      expect(result?.recurring).toBe(true);
      expect(result?.category).toBe(TransactionUICategory.Bills);
    });

    it("maps an income amount as positive", () => {
      // Arrange
      const formData = new FormData();
      formData.set("amount", "100");
      formData.set("transactionType", TransactionType.Income);
      formData.set("category", TransactionUICategory.General);
      formData.set("recipientOrSender", "Salary");

      // Act
      const result =
        transactionMapper.mapCreateTransactionInputToDBTransaction(formData);

      // Assert
      expect(result?.amount).toBe(100);
    });

    it("uses the default avatar when none is provided", () => {
      // Arrange
      const formData = new FormData();
      formData.set("amount", "10");
      formData.set("transactionType", TransactionType.Expense);
      formData.set("category", TransactionUICategory.Bills);
      formData.set("recipientOrSender", "Bill");

      // Act
      const result =
        transactionMapper.mapCreateTransactionInputToDBTransaction(formData);

      // Assert
      expect(result?.avatar).toBe(
        `./${constants.DefaultUserAvatarIconUrl}`,
      );
    });
  });

  describe("mapGetTransactionsInputToDBTransactionsParams", () => {
    it("applies defaults for page, count, and latest sort", () => {
      // Arrange & Act
      const result =
        transactionMapper.mapGetTransactionsInputToDBTransactionsParams(
          undefined,
        );

      // Assert
      expect(result.page).toBe(1);
      expect(result.transactionsCount).toBe(
        constants.TransactionRecordsPerPage,
      );
      expect(result.sortBy).toBe("date");
      expect(result.order).toBe("desc");
      expect(result.isRecurring).toBe(false);
    });

    it("clears category when All Transactions is selected", () => {
      // Arrange & Act
      const result =
        transactionMapper.mapGetTransactionsInputToDBTransactionsParams({
          category: TransactionUICategory.AllTransactions,
          sortBy: SortBy.Highest,
        });

      // Assert
      expect(result.category).toBeUndefined();
      expect(result.sortBy).toBe("amount");
      expect(result.order).toBe("desc");
    });

    it("keeps a concrete category filter", () => {
      // Arrange & Act
      const result =
        transactionMapper.mapGetTransactionsInputToDBTransactionsParams({
          category: TransactionUICategory.Groceries,
          page: 2,
          search: "milk",
          isRecurring: true,
        });

      // Assert
      expect(result.category).toBe(TransactionUICategory.Groceries);
      expect(result.page).toBe(2);
      expect(result.search).toBe("milk");
      expect(result.isRecurring).toBe(true);
    });
  });

  describe("mapGetTransactionsForCategoryInputToParams", () => {
    it("filters out All Transactions and defaults count to 3", () => {
      // Arrange & Act
      const result =
        transactionMapper.mapGetTransactionsForCategoryInputToParams({
          categories: [
            TransactionUICategory.AllTransactions,
            TransactionUICategory.Bills,
          ],
        });

      // Assert
      expect(result.categories).toEqual([TransactionUICategory.Bills]);
      expect(result.transactionsCount).toBe(3);
    });
  });

  describe("mapMonthlyExpensesByCategoryToOutput", () => {
    it("groups expenses by category", () => {
      // Arrange
      const expenses = [
        {
          id: "1",
          category: TransactionUICategory.Bills,
        },
        {
          id: "2",
          category: TransactionUICategory.Bills,
        },
        {
          id: "3",
          category: TransactionUICategory.Groceries,
        },
      ] as Transaction[];

      // Act
      const result =
        transactionMapper.mapMonthlyExpensesByCategoryToOutput(expenses);

      // Assert
      expect(result).toHaveLength(2);
      expect(
        result.find((group) => group.category === TransactionUICategory.Bills)
          ?.transactions,
      ).toHaveLength(2);
      expect(
        result.find(
          (group) => group.category === TransactionUICategory.Groceries,
        )?.transactions,
      ).toHaveLength(1);
    });
  });

  describe("mapCreateDBTransactionToOutput", () => {
    it("returns the transaction id", () => {
      // Arrange
      const transaction = { id: "tx-42" } as Transaction;

      // Act
      const result =
        transactionMapper.mapCreateDBTransactionToOutput(transaction);

      // Assert
      expect(result).toEqual({ id: "tx-42" });
    });
  });

  describe("mapGetTransactionsToOutput", () => {
    it("returns the response unchanged", () => {
      // Arrange
      const response = {
        transactions: [],
        paginationData: {
          allTransactionsCount: 0,
          page: 1,
          transactionsCount: 5,
        },
      };

      // Act
      const result = transactionMapper.mapGetTransactionsToOutput(response);

      // Assert
      expect(result).toBe(response);
    });
  });

  describe("mapGetTransactionsForCategoryToOutput", () => {
    it("returns the items unchanged", () => {
      // Arrange
      const items = [
        { category: TransactionUICategory.Bills, transactions: [] },
      ];

      // Act
      const result =
        transactionMapper.mapGetTransactionsForCategoryToOutput(items);

      // Assert
      expect(result).toBe(items);
    });
  });
});
