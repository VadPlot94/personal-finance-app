"use server";
import "server-only";

import type { Budget } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { Session } from "next-auth";
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
  const validatedResponse =
    await validationObjectWrapper<ICreateBudgetDTOOutput>(
      "create",
      async (session?: Session) => {
        return createBudget(formData, session?.user?.id!);
      },
    );

  syncChanges();
  return validatedResponse;
}

export async function editBudgetServerAction(
  _prevState: { success: boolean } | null,
  formData: IEditBudgetDTOInput,
): Promise<ServerActionResult<IEditBudgetDTOOutput>> {
  const validatedResponse = await validationObjectWrapper<IEditBudgetDTOOutput>(
    "update",
    async (session?: Session) => {
      return editBudget(formData, session?.user?.id!);
    },
  );

  syncChanges();
  return validatedResponse;
}

export async function deleteBudgetServerAction(
  id: string | null | undefined,
): Promise<ServerActionResult<boolean>> {
  const validatedResponse = await validationObjectWrapper<boolean>(
    "delete",
    async (session?: Session) => {
      return deleteBudget(id, session?.user?.id!);
    },
  );

  syncChanges();
  return validatedResponse;
}

function syncChanges() {
  revalidatePath("/budgets");
}
