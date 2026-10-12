import "server-only";
import type { Budget } from "@prisma/client";
import { CustomError, throwValidationError } from "@/back-end/common/errors";
import { budgetRepository } from "@/back-end/DAL/repositories/budget.repository";
import type {
  ICreateBudgetDTOInput,
  ICreateBudgetDTOOutput,
  IEditBudgetDTOInput,
  IEditBudgetDTOOutput,
  IGetAllBudgetsDTOOutput,
} from "@/back-end/dto-model-types/budget-dto-model.type";
import budgetMapper from "@/back-end/mappers/budget-mapper";
import {
  Theme,
  TransactionUICategory,
} from "@/shared/services/constants.service";
import type { IAddBudgetFormData } from "@/shared/services/types";
import validationService from "@/shared/services/validation.service";

class BudgetDbService {
  public async createBudget(
    budgetFormData: ICreateBudgetDTOInput,
    userId: string,
  ): Promise<ICreateBudgetDTOOutput> {
    const budgetModel =
      budgetMapper.mapCreateBudgetInputToDBBudget(budgetFormData);
    await this.validateCreateBudgetModel(budgetModel, userId);

    const response = await budgetRepository.create({
      data: {
        ...(budgetModel as Budget),
        userId,
      },
      select: { id: true },
    });

    return budgetMapper.mapCreateDBBudgetToOutput(response);
  }

  public async editBudget(
    budgetFormData: IEditBudgetDTOInput,
    userId: string,
  ): Promise<IEditBudgetDTOOutput> {
    const budgetModel = budgetMapper.mapEditBudgetInputToDBBudget(
      budgetFormData,
    ) as Budget;
    await this.validateEditBudgetModel(budgetModel, userId);

    const response = await budgetRepository.updateOwned({
      where: { id: budgetModel.id, userId },
      data: {
        category: budgetModel.category,
        maximum: budgetModel.maximum,
        theme: budgetModel.theme,
      },
      select: { id: true },
    });

    if (!response) {
      throw new CustomError("Failed to update budget");
    }

    return budgetMapper.mapEditDBBudgetToOutput(response);
  }

  public async deleteBudget(
    id: string | null | undefined,
    userId: string,
  ): Promise<boolean> {
    this.validateDeleteBudgetModel(id);

    const deletedCount = await budgetRepository.deleteOwned({
      where: { id: id!, userId },
    });

    if (!deletedCount) {
      throw new CustomError("Failed to delete budget");
    }

    return true;
  }

  public async getAllBudgets(userId: string): Promise<IGetAllBudgetsDTOOutput> {
    const budgets = await budgetRepository.getAll(userId);
    return budgetMapper.mapGetAllBudgetsToOutput(budgets);
  }

  private async validateCreateBudgetModel(
    budgetModel: Partial<Budget> | null,
    userId: string,
  ): Promise<never | boolean> {
    if (
      !budgetModel?.category ||
      budgetModel.category === TransactionUICategory.AllTransactions
    ) {
      const zodErrorResult =
        validationService.createCustomZodIssueResult<IAddBudgetFormData>(
          "budgetCategory",
          "Invalid data: category is required and cannot be 'All Transactions'",
        );
      throwValidationError(zodErrorResult);
    }

    if (!budgetModel?.maximum) {
      const zodErrorResult =
        validationService.createCustomZodIssueResult<IAddBudgetFormData>(
          "maximum",
          "Invalid data: maximum is required",
        );
      throwValidationError(zodErrorResult);
    }

    const isCategoryUnique = await budgetRepository.isUnique(
      "category",
      budgetModel?.category,
      userId,
      budgetModel?.id,
    );

    if (!isCategoryUnique) {
      const zodErrorResult =
        validationService.createCustomZodIssueResult<IAddBudgetFormData>(
          "budgetCategory",
          "Budget with such category already exists",
        );
      throwValidationError(zodErrorResult);
    }

    const zodValidationResult = validationService.validateAddBudgetSchema({
      id: budgetModel?.id ?? "",
      budgetCategory: budgetModel?.category || "",
      maximum: budgetModel?.maximum?.toString() || "",
      theme: (budgetModel?.theme as Theme) || Theme.NavyGrey,
    });
    throwValidationError(zodValidationResult);

    return true;
  }

  private async validateEditBudgetModel(
    budgetModel: Budget,
    userId: string,
  ): Promise<boolean> {
    if (!budgetModel.id) {
      const zodErrorResult =
        validationService.createCustomZodIssueResult<IAddBudgetFormData>(
          "id",
          "Invalid data: ID is required for update",
        );
      throwValidationError(zodErrorResult);
    }

    return this.validateCreateBudgetModel(budgetModel, userId);
  }

  private validateDeleteBudgetModel(id: string | null | undefined): boolean {
    if (!id) {
      const zodErrorResult =
        validationService.createCustomZodIssueResult<IAddBudgetFormData>(
          "id",
          "Invalid data: ID is required for delete",
        );
      throwValidationError(zodErrorResult);
    }

    return true;
  }
}

const budgetDbService = new BudgetDbService();
export default budgetDbService;
