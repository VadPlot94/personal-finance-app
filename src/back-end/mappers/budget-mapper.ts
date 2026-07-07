import { Budget } from "@prisma/client";
import {
  ICreateBudgetDTOInput,
  ICreateBudgetDTOOutput,
  IEditBudgetDTOInput,
  IEditBudgetDTOOutput,
} from "../dto-models/budget-dto.model";
import { Theme } from "@/shared/services/constants.service";
import { removeUndefinedFields } from "@/lib/utils";

export function mapCreateBudgetInputToDBBudget(
  input: ICreateBudgetDTOInput,
): Partial<Budget> | null {
  const budgetModel = getBudgetModel(input);
  return budgetModel;
}

export function mapCreateDBBudgetToOutput(
  dbOutput: ICreateBudgetDTOOutput,
): ICreateBudgetDTOOutput {
  return { id: dbOutput?.id };
}

export function mapEditBudgetInputToDBBudget(
  input: IEditBudgetDTOInput,
): Partial<Budget> | null {
  return mapCreateBudgetInputToDBBudget(input as ICreateBudgetDTOInput);
}

export function mapEditDBBudgetToOutput(
  dbOutput: IEditBudgetDTOOutput,
): IEditBudgetDTOOutput {
  return mapCreateDBBudgetToOutput(dbOutput as ICreateBudgetDTOOutput);
}

function getBudgetModel(formData: FormData): Partial<Budget> | null {
  if (!formData) {
    return null;
  }

  const budgetModel: Partial<Budget> = {
    id: formData.get("id") as string,
    userId: formData.get("userId") as string | null,
    category: formData.get("budgetCategory") as string,
    maximum: Number(
      formData.get("maximum")?.toString()?.replaceAll(" ", "") || 0,
    ),
    theme: (formData.get("theme") as Theme) || Theme.NavyGrey,
  };

  return removeUndefinedFields(budgetModel);
}
