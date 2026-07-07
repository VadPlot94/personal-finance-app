import validationService from "@/shared/services/validation.service";
import { Budget } from "@prisma/client";
import { budgetRepository } from "../repositories/budget.repository";
import {
  CustomError,
  throwValidationError,
} from "@/back-end/server-actions/common";
import {
  mapCreateDBBudgetToOutput,
  mapCreateBudgetInputToDBBudget,
  mapEditDBBudgetToOutput,
  mapEditBudgetInputToDBBudget,
} from "@/back-end/mappers/budget-mapper";
import {
  Theme,
  TransactionUICategory,
} from "@/shared/services/constants.service";
import {
  ICreateBudgetDTOInput,
  ICreateBudgetDTOOutput,
  IEditBudgetDTOInput,
  IEditBudgetDTOOutput,
  IGetAllBudgetsDTOOutput,
} from "@/back-end/dto-models/budget-dto.model";
import { IAddBudgetFormData } from "@/front-end/components/budgets/types";

export async function createBudget(
  budgetFormData: ICreateBudgetDTOInput,
  userId: string,
): Promise<ICreateBudgetDTOOutput> {
  const budgetModel = mapCreateBudgetInputToDBBudget(budgetFormData);
  await validateCreateBudgetModel(budgetModel, userId);

  const response = await budgetRepository.create({
    data: {
      ...(budgetModel as Budget),
      userId,
    },
    select: { id: true },
  });

  return mapCreateDBBudgetToOutput(response);
}

export async function editBudget(
  budgetFormData: IEditBudgetDTOInput,
  userId: string,
): Promise<IEditBudgetDTOOutput> {
  const budgetModel = mapEditBudgetInputToDBBudget(budgetFormData) as Budget;
  await validateEditBudgetModel(budgetModel, userId);

  const response = await budgetRepository.update({
    where: { id: budgetModel.id },
    data: {
      category: budgetModel.category,
      maximum: budgetModel.maximum,
      theme: budgetModel.theme,
    },
    select: { id: true },
  });

  return mapEditDBBudgetToOutput(response);
}

export async function deleteBudget(
  id: string,
  userId: string,
): Promise<boolean> {
  validateDeleteBudgetModel(id);

  const hasOwnership = await budgetRepository.ensureDataOwnership(id, userId);
  if (!hasOwnership) {
    throw new CustomError("Unauthorized");
  }

  const response = await budgetRepository.delete({
    where: { id },
  });

  return id === response?.id;
}

export async function getAllBudgets(
  userId: string,
): Promise<IGetAllBudgetsDTOOutput> {
  const budgets = await budgetRepository.getAll(userId);
  return { budgets };
}

async function validateCreateBudgetModel(
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

  if (!budgetModel.maximum) {
    const zodErrorResult =
      validationService.createCustomZodIssueResult<IAddBudgetFormData>(
        "maximum",
        "Invalid data: maximum is required",
      );
    throwValidationError(zodErrorResult);
  }

  const isCategoryUnique = await budgetRepository.isCategoryUnique(
    budgetModel.category,
    budgetModel.id,
    userId,
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
    id: budgetModel.id ?? "",
    budgetCategory: budgetModel.category,
    maximum: budgetModel.maximum.toString(),
    theme: (budgetModel.theme as Theme) || Theme.NavyGrey,
  });
  throwValidationError(zodValidationResult);

  return true;
}

async function validateEditBudgetModel(
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

  return validateCreateBudgetModel(budgetModel, userId);

  // if (!budgetModel.category || !budgetModel.maximum) {
  //   throw new CustomError("Invalid data: category and maximum are required");
  // }

  // const isCategoryUnique = await budgetRepository.isCategoryUnique(
  //   budgetModel.category,
  //   budgetModel.id,
  //   userId,
  // );

  // if (!isCategoryUnique) {
  //   throw new CustomError("Budget with such category already exists");
  // }

  // return true;
}

function validateDeleteBudgetModel(id: string): boolean {
  if (!id) {
    const zodErrorResult =
      validationService.createCustomZodIssueResult<IAddBudgetFormData>(
        "id",
        "Invalid data: ID is required for delete",
      );
    throwValidationError(zodErrorResult);
  }
  // if (!id) {
  //   throw new CustomError("ID is required for delete");
  // }

  return true;
}
