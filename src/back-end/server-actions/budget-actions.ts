"use server";
import "server-only";

import type { Budget } from "@prisma/client";
import { updateTag } from "next/cache";
import type { Session } from "next-auth";
import { budgetsTag } from "@/back-end/DAL/cache/cache-tags";
import {
  createBudget,
  deleteBudget,
  editBudget,
  getAllBudgets,
} from "@/back-end/DAL/db-services/budget-db.service";
import type {
  ICreateBudgetDTOInput,
  ICreateBudgetDTOOutput,
  IEditBudgetDTOInput,
  IEditBudgetDTOOutput,
  IGetAllBudgetsDTOOutput,
} from "@/back-end/dto-models/budget-dto.model";
import { validationObjectWrapper } from "@/back-end/server-actions/common";
import type { ServerActionResult } from "@/back-end/server-actions/types";

export async function getAllBudgetsServerAction(): Promise<
  ServerActionResult<Budget[]>
> {
  const validatedResponse =
    await validationObjectWrapper<IGetAllBudgetsDTOOutput>(
      "get",
      async (session?: Session) => {
        return getAllBudgets(session?.user?.id!);
      },
    );

  return {
    ...validatedResponse,
    data: validatedResponse.data?.budgets,
  };
}

export async function addBudgetServerAction(
  _prevState: { success: boolean } | null,
  formData: ICreateBudgetDTOInput,
): Promise<ServerActionResult<ICreateBudgetDTOOutput>> {
  return await validationObjectWrapper<ICreateBudgetDTOOutput>(
    "create",
    async (session?: Session) => {
      const userId = session?.user?.id!;
      const result = await createBudget(formData, userId);
      syncChanges(userId);
      return result;
    },
  );
}

export async function editBudgetServerAction(
  _prevState: { success: boolean } | null,
  formData: IEditBudgetDTOInput,
): Promise<ServerActionResult<IEditBudgetDTOOutput>> {
  return await validationObjectWrapper<IEditBudgetDTOOutput>(
    "update",
    async (session?: Session) => {
      const userId = session?.user?.id!;
      const result = await editBudget(formData, userId);
      syncChanges(userId);
      return result;
    },
  );
}

export async function deleteBudgetServerAction(
  id: string | null | undefined,
): Promise<ServerActionResult<boolean>> {
  return await validationObjectWrapper<boolean>(
    "delete",
    async (session?: Session) => {
      const userId = session?.user?.id!;
      const result = await deleteBudget(id, userId);
      syncChanges(userId);
      return result;
    },
  );
}

function syncChanges(userId: string) {
  updateTag(budgetsTag(userId));
}
