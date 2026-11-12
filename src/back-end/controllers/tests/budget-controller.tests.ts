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

vi.mock("@/back-end/DAL/db-services/budget-db.service", () => ({
  default: {
    getAllBudgets: vi.fn(),
    createBudget: vi.fn(),
    editBudget: vi.fn(),
    deleteBudget: vi.fn(),
  },
}));

import { updateTag } from "next/cache";
import budgetController from "@/back-end/controllers/budget-controller";
import { budgetsTag } from "@/back-end/DAL/cache/cache-tags";
import authService from "@/back-end/DAL/db-services/auth.service";
import budgetDbService from "@/back-end/DAL/db-services/budget-db.service";

describe("BudgetController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.getAuthenticatedSession).mockResolvedValue({
      user: { id: "user-1" },
    } as Session);
  });

  describe("getAllBudgets", () => {
    it("unwraps budgets from the db service response", async () => {
      // Arrange
      const budgets = [{ id: "b-1" }];
      vi.mocked(budgetDbService.getAllBudgets).mockResolvedValue({
        budgets: budgets as never,
      });

      // Act
      const result = await budgetController.getAllBudgets();

      // Assert
      expect(budgetDbService.getAllBudgets).toHaveBeenCalledWith("user-1");
      expect(result.success).toBe(true);
      expect(result.data).toEqual(budgets);
    });
  });

  describe("addBudget", () => {
    it("creates a budget and invalidates the budgets cache tag", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(budgetDbService.createBudget).mockResolvedValue({ id: "b-1" });

      // Act
      const result = await budgetController.addBudget(null, formData);

      // Assert
      expect(budgetDbService.createBudget).toHaveBeenCalledWith(
        formData,
        "user-1",
      );
      expect(updateTag).toHaveBeenCalledWith(budgetsTag("user-1"));
      expect(result.success).toBe(true);
      expect(result.data).toEqual({ id: "b-1" });
    });
  });

  describe("editBudget", () => {
    it("updates a budget and syncs cache", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(budgetDbService.editBudget).mockResolvedValue({ id: "b-1" });

      // Act
      const result = await budgetController.editBudget(null, formData);

      // Assert
      expect(budgetDbService.editBudget).toHaveBeenCalledWith(
        formData,
        "user-1",
      );
      expect(updateTag).toHaveBeenCalledWith(budgetsTag("user-1"));
      expect(result.success).toBe(true);
    });
  });

  describe("deleteBudget", () => {
    it("deletes a budget and syncs cache", async () => {
      // Arrange
      vi.mocked(budgetDbService.deleteBudget).mockResolvedValue(true);

      // Act
      const result = await budgetController.deleteBudget("b-1");

      // Assert
      expect(budgetDbService.deleteBudget).toHaveBeenCalledWith(
        "b-1",
        "user-1",
      );
      expect(updateTag).toHaveBeenCalledWith(budgetsTag("user-1"));
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });
  });
});
