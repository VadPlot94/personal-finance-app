import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/back-end/lib/test-utils/server-only.mock";
import "@/shared/lib/test-utils/logger.service.mock";
import { CustomError } from "@/back-end/common/errors";
import {
  Theme,
  TransactionUICategory,
} from "@/shared/services/constants.service";

vi.mock("@/back-end/DAL/repositories/budget.repository", () => ({
  budgetRepository: {
    create: vi.fn(),
    updateOwned: vi.fn(),
    deleteOwned: vi.fn(),
    getAll: vi.fn(),
    isUnique: vi.fn(),
  },
}));

vi.mock("@/back-end/mappers/budget-mapper", () => ({
  default: {
    mapCreateBudgetInputToDBBudget: vi.fn(),
    mapEditBudgetInputToDBBudget: vi.fn(),
    mapCreateDBBudgetToOutput: vi.fn(),
    mapEditDBBudgetToOutput: vi.fn(),
    mapGetAllBudgetsToOutput: vi.fn(),
  },
}));

vi.mock("@/shared/services/validation.service", () => ({
  default: {
    createCustomZodIssueResult: vi.fn(),
    createErrorsWithPath: vi.fn(() => ({ field: "required" })),
    validateAddBudgetSchema: vi.fn(),
  },
}));

import budgetDbService from "@/back-end/DAL/db-services/budget-db.service";
import { budgetRepository } from "@/back-end/DAL/repositories/budget.repository";
import budgetMapper from "@/back-end/mappers/budget-mapper";
import validationService from "@/shared/services/validation.service";

describe("BudgetDbService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllBudgets", () => {
    it("maps repository budgets to output", async () => {
      // Arrange
      const budgets = [{ id: "b-1" }];
      vi.mocked(budgetRepository.getAll).mockResolvedValue(budgets as never);
      vi.mocked(budgetMapper.mapGetAllBudgetsToOutput).mockReturnValue({
        budgets: budgets as never,
      });

      // Act
      const result = await budgetDbService.getAllBudgets("user-1");

      // Assert
      expect(budgetRepository.getAll).toHaveBeenCalledWith("user-1");
      expect(result).toEqual({ budgets });
    });
  });

  describe("createBudget", () => {
    it("validates, creates, and maps the created budget", async () => {
      // Arrange
      const formData = new FormData();
      const budgetModel = {
        category: TransactionUICategory.Entertainment,
        maximum: 200,
        theme: Theme.Green,
      };
      vi.mocked(budgetMapper.mapCreateBudgetInputToDBBudget).mockReturnValue(
        budgetModel,
      );
      vi.mocked(budgetRepository.isUnique).mockResolvedValue(true);
      vi.mocked(validationService.validateAddBudgetSchema).mockReturnValue({
        success: true,
        data: {},
      } as never);
      vi.mocked(budgetRepository.create).mockResolvedValue({ id: "b-1" });
      vi.mocked(budgetMapper.mapCreateDBBudgetToOutput).mockReturnValue({
        id: "b-1",
      });

      // Act
      const result = await budgetDbService.createBudget(formData, "user-1");

      // Assert
      expect(budgetRepository.create).toHaveBeenCalled();
      expect(result).toEqual({ id: "b-1" });
    });

    it("throws when the category is missing", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(budgetMapper.mapCreateBudgetInputToDBBudget).mockReturnValue({
        maximum: 200,
      });
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["budgetCategory"], message: "required" }] },
      } as never);

      // Act & Assert
      await expect(
        budgetDbService.createBudget(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("throws when category is All Transactions", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(budgetMapper.mapCreateBudgetInputToDBBudget).mockReturnValue({
        category: TransactionUICategory.AllTransactions,
        maximum: 200,
      });
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["budgetCategory"], message: "required" }] },
      } as never);

      // Act & Assert
      await expect(
        budgetDbService.createBudget(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("throws when maximum is missing", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(budgetMapper.mapCreateBudgetInputToDBBudget).mockReturnValue({
        category: TransactionUICategory.Bills,
      });
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["maximum"], message: "required" }] },
      } as never);

      // Act & Assert
      await expect(
        budgetDbService.createBudget(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("throws when the category is not unique", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(budgetMapper.mapCreateBudgetInputToDBBudget).mockReturnValue({
        category: TransactionUICategory.Bills,
        maximum: 200,
      });
      vi.mocked(budgetRepository.isUnique).mockResolvedValue(false);
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["budgetCategory"], message: "exists" }] },
      } as never);

      // Act & Assert
      await expect(
        budgetDbService.createBudget(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });
  });

  describe("editBudget", () => {
    it("throws when id is missing for update", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(budgetMapper.mapEditBudgetInputToDBBudget).mockReturnValue({
        category: TransactionUICategory.Bills,
        maximum: 200,
      } as never);
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["id"], message: "required" }] },
      } as never);

      // Act & Assert
      await expect(
        budgetDbService.editBudget(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("updates an owned budget", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(budgetMapper.mapEditBudgetInputToDBBudget).mockReturnValue({
        id: "b-1",
        category: TransactionUICategory.Bills,
        maximum: 200,
        theme: Theme.Green,
      } as never);
      vi.mocked(budgetRepository.isUnique).mockResolvedValue(true);
      vi.mocked(validationService.validateAddBudgetSchema).mockReturnValue({
        success: true,
        data: {},
      } as never);
      vi.mocked(budgetRepository.updateOwned).mockResolvedValue({ id: "b-1" });
      vi.mocked(budgetMapper.mapEditDBBudgetToOutput).mockReturnValue({
        id: "b-1",
      });

      // Act
      const result = await budgetDbService.editBudget(formData, "user-1");

      // Assert
      expect(result).toEqual({ id: "b-1" });
    });

    it("throws when updateOwned returns null", async () => {
      // Arrange
      const formData = new FormData();
      vi.mocked(budgetMapper.mapEditBudgetInputToDBBudget).mockReturnValue({
        id: "b-1",
        category: TransactionUICategory.Bills,
        maximum: 200,
        theme: Theme.Green,
      } as never);
      vi.mocked(budgetRepository.isUnique).mockResolvedValue(true);
      vi.mocked(validationService.validateAddBudgetSchema).mockReturnValue({
        success: true,
        data: {},
      } as never);
      vi.mocked(budgetRepository.updateOwned).mockResolvedValue(null);

      // Act & Assert
      await expect(
        budgetDbService.editBudget(formData, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });
  });

  describe("deleteBudget", () => {
    it("throws when id is missing", async () => {
      // Arrange
      vi.mocked(validationService.createCustomZodIssueResult).mockReturnValue({
        success: false,
        error: { issues: [{ path: ["id"], message: "required" }] },
      } as never);

      // Act & Assert
      await expect(
        budgetDbService.deleteBudget(undefined, "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });

    it("deletes an owned budget", async () => {
      // Arrange
      vi.mocked(budgetRepository.deleteOwned).mockResolvedValue(1);

      // Act
      const result = await budgetDbService.deleteBudget("b-1", "user-1");

      // Assert
      expect(budgetRepository.deleteOwned).toHaveBeenCalledWith({
        where: { id: "b-1", userId: "user-1" },
      });
      expect(result).toBe(true);
    });

    it("throws when deleteOwned affects no rows", async () => {
      // Arrange
      vi.mocked(budgetRepository.deleteOwned).mockResolvedValue(0);

      // Act & Assert
      await expect(
        budgetDbService.deleteBudget("b-1", "user-1"),
      ).rejects.toBeInstanceOf(CustomError);
    });
  });
});
