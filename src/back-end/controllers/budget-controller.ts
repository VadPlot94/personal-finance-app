import "server-only";

import type { Budget } from "@prisma/client";
import { cacheLife, cacheTag, updateTag } from "next/cache";
import type { Session } from "next-auth";
import { BaseController } from "@/back-end/controllers/base-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";
import { budgetsTag } from "@/back-end/DAL/cache/cache-tags";
import budgetDbService from "@/back-end/DAL/db-services/budget-db.service";
import type {
  ICreateBudgetDTOInput,
  ICreateBudgetDTOOutput,
  IEditBudgetDTOInput,
  IEditBudgetDTOOutput,
  IGetAllBudgetsDTOOutput,
} from "@/back-end/dto-model-types/budget-dto-model.type";

async function getAllBudgetsCached(
  userId: string,
): Promise<IGetAllBudgetsDTOOutput> {
  "use cache";
  cacheTag(budgetsTag(userId));
  cacheLife("minutes");
  return budgetDbService.getAllBudgets(userId);
}

class BudgetController extends BaseController {
  public async getAllBudgets(): Promise<ValidationResponse<Budget[]>> {
    const validatedResponse =
      await this.validationObjectWrapper<IGetAllBudgetsDTOOutput>(
        "get",
        async (session?: Session) => {
          return getAllBudgetsCached(session?.user?.id!);
        },
      );

    return {
      ...validatedResponse,
      data: validatedResponse.data?.budgets,
    };
  }

  public async addBudget(
    _prevState: { success: boolean } | null,
    formData: ICreateBudgetDTOInput,
  ): Promise<ValidationResponse<ICreateBudgetDTOOutput>> {
    return await this.validationObjectWrapper<ICreateBudgetDTOOutput>(
      "create",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        const result = await budgetDbService.createBudget(formData, userId);
        this.syncChanges(userId);
        return result;
      },
    );
  }

  public async editBudget(
    _prevState: { success: boolean } | null,
    formData: IEditBudgetDTOInput,
  ): Promise<ValidationResponse<IEditBudgetDTOOutput>> {
    return await this.validationObjectWrapper<IEditBudgetDTOOutput>(
      "update",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        const result = await budgetDbService.editBudget(formData, userId);
        this.syncChanges(userId);
        return result;
      },
    );
  }

  public async deleteBudget(
    id: string | null | undefined,
  ): Promise<ValidationResponse<boolean>> {
    return await this.validationObjectWrapper<boolean>(
      "delete",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        const result = await budgetDbService.deleteBudget(id, userId);
        this.syncChanges(userId);
        return result;
      },
    );
  }

  private syncChanges(userId: string) {
    updateTag(budgetsTag(userId));
  }
}

const budgetController = new BudgetController();
export default budgetController;
