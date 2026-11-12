import { describe, expect, it } from "vitest";
import balanceService from "@/shared/services/balance.service";

describe("BalanceService", () => {
  describe("computeFromSums", () => {
    it("sets current to income minus expenses", () => {
      // Arrange & Act
      const result = balanceService.computeFromSums(3814.25, 1700.5);

      // Assert
      expect(result.current).toBe(2113.75);
    });

    it("returns the income sum", () => {
      // Arrange & Act
      const result = balanceService.computeFromSums(3814.25, 1700.5);

      // Assert
      expect(result.income).toBe(3814.25);
    });

    it("returns the expenses sum", () => {
      // Arrange & Act
      const result = balanceService.computeFromSums(3814.25, 1700.5);

      // Assert
      expect(result.expenses).toBe(1700.5);
    });

    it("returns zeros when there are no transactions", () => {
      // Arrange & Act
      const result = balanceService.computeFromSums(0, 0);

      // Assert
      expect(result).toEqual({ current: 0, income: 0, expenses: 0 });
    });

    it("treats NaN income as 0", () => {
      // Arrange & Act
      const result = balanceService.computeFromSums(Number.NaN, 10);

      // Assert
      expect(result.income).toBe(0);
    });

    it("treats NaN expenses as 0", () => {
      // Arrange & Act
      const result = balanceService.computeFromSums(10, Number.NaN);

      // Assert
      expect(result.expenses).toBe(0);
    });
  });

  describe("computeAvailable", () => {
    it("subtracts pot totals from current", () => {
      // Arrange & Act
      const result = balanceService.computeAvailable(2113.75, 870);

      // Assert
      expect(result).toBe(1243.75);
    });

    it("equals current when pots are empty", () => {
      // Arrange & Act
      const result = balanceService.computeAvailable(2113.75, 0);

      // Assert
      expect(result).toBe(2113.75);
    });

    it("treats NaN current as 0", () => {
      // Arrange & Act
      const result = balanceService.computeAvailable(Number.NaN, 50);

      // Assert
      expect(result).toBe(-50);
    });

    it("treats NaN pots total as 0", () => {
      // Arrange & Act
      const result = balanceService.computeAvailable(100, Number.NaN);

      // Assert
      expect(result).toBe(100);
    });
  });
});
