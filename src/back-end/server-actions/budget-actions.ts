"use server";

import { Budget } from "@prisma/client";
import { ServerActionResult } from "./types";
import { revalidatePath } from "next/cache";
import { validationObjectWrapper } from "./common";
import { Session } from "next-auth";
import {
  createBudget,
  editBudget,
  deleteBudget,
  getAllBudgets,
} from "../DAL/db-services/budget-db.service";
import {
  ICreateBudgetDTOInput,
  ICreateBudgetDTOOutput,
  IEditBudgetDTOInput,
  IEditBudgetDTOOutput,
  IGetAllBudgetsDTOOutput,
} from "../dto-models/budget-dto.model";

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
  prevState: { success: boolean } | null,
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
  prevState: { success: boolean } | null,
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
