import "server-only";
import type { Budget } from "@prisma/client";
import type {
  ICreateBudgetDTOInput,
  ICreateBudgetDTOOutput,
  IEditBudgetDTOInput,
  IEditBudgetDTOOutput,
  IGetAllBudgetsDTOOutput,
} from "@/back-end/dto-model-types/budget-dto-model.type";
import { removeUndefinedFields } from "@/lib/utils";
import { Theme } from "@/shared/services/constants.service";

class BudgetMapper {
  public mapCreateBudgetInputToDBBudget(
    input: ICreateBudgetDTOInput,
  ): Partial<Budget> | null {
    return this.getBudgetModel(input);
  }

  public mapCreateDBBudgetToOutput(
    dbOutput: ICreateBudgetDTOOutput,
  ): ICreateBudgetDTOOutput {
    return { id: dbOutput?.id };
  }

  public mapEditBudgetInputToDBBudget(
    input: IEditBudgetDTOInput,
  ): Partial<Budget> | null {
    return this.mapCreateBudgetInputToDBBudget(input as ICreateBudgetDTOInput);
  }

  public mapEditDBBudgetToOutput(
    dbOutput: IEditBudgetDTOOutput,
  ): IEditBudgetDTOOutput {
    return this.mapCreateDBBudgetToOutput(dbOutput as ICreateBudgetDTOOutput);
  }

  public mapGetAllBudgetsToOutput(budgets: Budget[]): IGetAllBudgetsDTOOutput {
    return { budgets };
  }

  private getBudgetModel(formData: FormData): Partial<Budget> | null {
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
}

const budgetMapper = new BudgetMapper();
export default budgetMapper;
