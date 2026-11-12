import { describe, expect, it } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import {
  balanceTag,
  budgetsTag,
  potsTag,
} from "@/back-end/DAL/cache/cache-tags";

describe("cache-tags", () => {
  describe("balanceTag", () => {
    it("builds a balance tag for the user", () => {
      // Arrange & Act
      const result = balanceTag("user-1");

      // Assert
      expect(result).toBe("balance:user-1");
    });
  });

  describe("potsTag", () => {
    it("builds a pots tag for the user", () => {
      // Arrange & Act
      const result = potsTag("user-1");

      // Assert
      expect(result).toBe("pots:user-1");
    });
  });

  describe("budgetsTag", () => {
    it("builds a budgets tag for the user", () => {
      // Arrange & Act
      const result = budgetsTag("user-1");

      // Assert
      expect(result).toBe("budgets:user-1");
    });
  });
});
