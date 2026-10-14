import { describe, expect, it } from "vitest";
import transactionService from "@/front-end/services/transaction.service";

describe("TransactionService", () => {
  describe("getPaginationPagesNumber", () => {
    it("returns 1 when pagination data is undefined", () => {
      // Arrange & Act
      const result = transactionService.getPaginationPagesNumber(undefined);

      // Assert
      expect(result).toBe(1);
    });

    it("returns 1 when transactionsCount is 0", () => {
      // Arrange
      const paginationData = { transactionsCount: 0 };

      // Act
      const result =
        transactionService.getPaginationPagesNumber(paginationData);

      // Assert
      expect(result).toBe(1);
    });

    it("computes total pages from counts", () => {
      // Arrange
      const paginationData = {
        transactionsCount: 10,
        allTransactionsCount: 25,
      };

      // Act
      const result =
        transactionService.getPaginationPagesNumber(paginationData);

      // Assert
      expect(result).toBe(3);
    });
  });

  describe("getSearchValue", () => {
    it("trims search input", () => {
      // Arrange
      const searchValue = "  hello  ";

      // Act
      const result = transactionService.getSearchValue(searchValue);

      // Assert
      expect(result).toBe("hello");
    });
  });

  describe("isNoTransactionsSearchFound", () => {
    it("is true when search is non-empty and results are empty", () => {
      // Arrange
      const searchValue = "coffee";
      const transactions: never[] = [];

      // Act
      const result = transactionService.isNoTransactionsSearchFound(
        searchValue,
        transactions,
      );

      // Assert
      expect(result).toBe(true);
    });

    it("is false when search is empty", () => {
      // Arrange
      const searchValue = "";
      const transactions: never[] = [];

      // Act
      const result = transactionService.isNoTransactionsSearchFound(
        searchValue,
        transactions,
      );

      // Assert
      expect(result).toBe(false);
    });

    it("is false when results exist", () => {
      // Arrange
      const searchValue = "coffee";
      const transactions = [{ id: "1" } as never];

      // Act
      const result = transactionService.isNoTransactionsSearchFound(
        searchValue,
        transactions,
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("getTransactionAmount", () => {
    it("formats positive amounts with a plus sign", () => {
      // Arrange
      const amount = 12.5;

      // Act
      const result = transactionService.getTransactionAmount(amount);

      // Assert
      expect(result).toBe("+$12.50");
    });

    it("formats negative amounts with a minus sign", () => {
      // Arrange
      const amount = -8;

      // Act
      const result = transactionService.getTransactionAmount(amount);

      // Assert
      expect(result).toBe("-$8.00");
    });
  });

  describe("getTransactionDate", () => {
    it("formats a valid date in en-US short form", () => {
      // Arrange
      const date = new Date(2024, 0, 15);

      // Act
      const result = transactionService.getTransactionDate(date);

      // Assert
      expect(result).toBe("Jan 15, 2024");
    });
  });
});
