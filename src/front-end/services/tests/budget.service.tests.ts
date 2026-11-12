import type { Transaction } from "@prisma/client";
import { describe, expect, it } from "vitest";
import budgetService from "@/front-end/services/budget.service";

describe("BudgetService", () => {
  describe("getBudgetPercentageData", () => {
    it("returns zero spent when transactions are undefined", () => {
      // Arrange & Act
      const result = budgetService.getBudgetPercentageData(100, undefined);

      // Assert
      expect(result.spent).toBe(0);
      expect(result.remaining).toBe(100);
      expect(result.percentBarProgress).toBe(0);
    });

    it("sums absolute spent from transaction amounts", () => {
      // Arrange
      const transactions = [
        { amount: -40 } as Transaction,
        { amount: -10 } as Transaction,
      ];

      // Act
      const result = budgetService.getBudgetPercentageData(100, transactions);

      // Assert
      expect(result.spent).toBe(50);
    });

    it("computes remaining as maximum minus spent", () => {
      // Arrange
      const transactions = [{ amount: -25 } as Transaction];

      // Act
      const result = budgetService.getBudgetPercentageData(100, transactions);

      // Assert
      expect(result.remaining).toBe(75);
    });

    it("computes progress percentage from spent and maximum", () => {
      // Arrange
      const transactions = [{ amount: -50 } as Transaction];

      // Act
      const result = budgetService.getBudgetPercentageData(100, transactions);

      // Assert
      expect(result.percentBarProgress).toBe(50);
    });
  });
});
