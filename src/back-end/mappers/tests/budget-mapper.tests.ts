import type { Budget } from "@prisma/client";
import { describe, expect, it } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import budgetMapper from "@/back-end/mappers/budget-mapper";
import {
  Theme,
  TransactionUICategory,
} from "@/shared/services/constants.service";

describe("BudgetMapper", () => {
  describe("mapCreateBudgetInputToDBBudget", () => {
    it("maps form fields and strips spaces from maximum", () => {
      // Arrange
      const formData = new FormData();
      formData.set("id", "budget-1");
      formData.set("userId", "user-1");
      formData.set("budgetCategory", TransactionUICategory.Entertainment);
      formData.set("maximum", "1 200");
      formData.set("theme", Theme.Green);

      // Act
      const result = budgetMapper.mapCreateBudgetInputToDBBudget(formData);

      // Assert
      expect(result).toEqual({
        id: "budget-1",
        userId: "user-1",
        category: TransactionUICategory.Entertainment,
        maximum: 1200,
        theme: Theme.Green,
      });
    });

    it("defaults theme to NavyGrey when missing", () => {
      // Arrange
      const formData = new FormData();
      formData.set("budgetCategory", TransactionUICategory.Bills);
      formData.set("maximum", "100");

      // Act
      const result = budgetMapper.mapCreateBudgetInputToDBBudget(formData);

      // Assert
      expect(result?.theme).toBe(Theme.NavyGrey);
    });
  });

  describe("mapCreateDBBudgetToOutput", () => {
    it("returns the created budget id", () => {
      // Arrange & Act
      const result = budgetMapper.mapCreateDBBudgetToOutput({ id: "b-1" });

      // Assert
      expect(result).toEqual({ id: "b-1" });
    });
  });

  describe("mapEditBudgetInputToDBBudget", () => {
    it("reuses create mapping for edit input", () => {
      // Arrange
      const formData = new FormData();
      formData.set("budgetCategory", TransactionUICategory.Bills);
      formData.set("maximum", "50");

      // Act
      const result = budgetMapper.mapEditBudgetInputToDBBudget(formData);

      // Assert
      expect(result?.category).toBe(TransactionUICategory.Bills);
      expect(result?.maximum).toBe(50);
    });
  });

  describe("mapEditDBBudgetToOutput", () => {
    it("returns the edited budget id", () => {
      // Arrange & Act
      const result = budgetMapper.mapEditDBBudgetToOutput({ id: "b-2" });

      // Assert
      expect(result).toEqual({ id: "b-2" });
    });
  });

  describe("mapGetAllBudgetsToOutput", () => {
    it("wraps budgets in an object", () => {
      // Arrange
      const budgets = [{ id: "b-1" } as Budget];

      // Act
      const result = budgetMapper.mapGetAllBudgetsToOutput(budgets);

      // Assert
      expect(result).toEqual({ budgets });
    });
  });
});
