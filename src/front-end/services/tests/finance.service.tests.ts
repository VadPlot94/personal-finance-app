import { describe, expect, it } from "vitest";
import financeService from "@/front-end/services/finance.service";

describe("FinanceService", () => {
  describe("calculateProgressPercentage", () => {
    it("returns 100 when target is 0", () => {
      // Arrange & Act
      const result = financeService.calculateProgressPercentage(50, 0);

      // Assert
      expect(result).toBe(100);
    });

    it("returns 0 when current is 0", () => {
      // Arrange & Act
      const result = financeService.calculateProgressPercentage(0, 100);

      // Assert
      expect(result).toBe(0);
    });

    it("returns 0 when current is NaN", () => {
      // Arrange & Act
      const result = financeService.calculateProgressPercentage(
        Number.NaN,
        100,
      );

      // Assert
      expect(result).toBe(0);
    });

    it("clamps percentage above 100", () => {
      // Arrange & Act
      const result = financeService.calculateProgressPercentage(150, 100);

      // Assert
      expect(result).toBe(100);
    });

    it("clamps percentage below 0", () => {
      // Arrange & Act
      const result = financeService.calculateProgressPercentage(-10, 100);

      // Assert
      expect(result).toBe(0);
    });

    it("rounds to two decimal places", () => {
      // Arrange & Act
      const result = financeService.calculateProgressPercentage(1, 3);

      // Assert
      expect(result).toBe(33.33);
    });
  });

  describe("getStrPercentage", () => {
    it("formats a numeric percentage", () => {
      // Arrange & Act
      const result = financeService.getStrPercentage(12.5);

      // Assert
      expect(result).toBe("12.50%");
    });

    it("returns placeholder for NaN", () => {
      // Arrange & Act
      const result = financeService.getStrPercentage(Number.NaN);

      // Assert
      expect(result).toBe("--.--%");
    });
  });

  describe("createCacheNumberFormat", () => {
    it("formats thousands with spaces", () => {
      // Arrange & Act
      const result = financeService.createCacheNumberFormat(1234567);

      // Assert
      expect(result).toBe("1 234 567");
    });

    it("preserves decimal part", () => {
      // Arrange & Act
      const result = financeService.createCacheNumberFormat("1234.56");

      // Assert
      expect(result).toBe("1 234.56");
    });

    it("returns empty string for undefined", () => {
      // Arrange & Act
      const result = financeService.createCacheNumberFormat(undefined);

      // Assert
      expect(result).toBe("");
    });

    it("returns empty string for empty input", () => {
      // Arrange & Act
      const result = financeService.createCacheNumberFormat("");

      // Assert
      expect(result).toBe("");
    });

    it("returns original string for non-numeric input", () => {
      // Arrange & Act
      const result = financeService.createCacheNumberFormat("abc");

      // Assert
      expect(result).toBe("abc");
    });
  });
});
