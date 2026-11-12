import type { Pot } from "@prisma/client";
import { describe, expect, it } from "vitest";
import potService from "@/shared/services/pot.service";

describe("PotService", () => {
  describe("getAllSavedPotsMoney", () => {
    it("returns 0 for an empty list", () => {
      // Arrange & Act
      const result = potService.getAllSavedPotsMoney([]);

      // Assert
      expect(result).toBe(0);
    });

    it("sums pot totals", () => {
      // Arrange
      const pots = [{ total: 10 }, { total: 25.5 }, { total: 4.5 }] as Pot[];

      // Act
      const result = potService.getAllSavedPotsMoney(pots);

      // Assert
      expect(result).toBe(40);
    });
  });
});
