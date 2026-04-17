"use server";

import { Budget } from "@prisma/client";
import { ServerActionResult } from "./types";
import { budgetRepository } from "@/back-end/DAL/repositories/budget.repository";
import { revalidatePath } from "next/cache";
import { CustomError, validationObjectWrapper } from "./common";
import {
  Theme,
  TransactionUICategory,
} from "@/shared/services/constants.service";
import { Session } from "next-auth";

export async function getAllBudgetsServerAction(): Promise<
  ServerActionResult<Budget[]>
> {
  return await validationObjectWrapper<Budget[]>(
    "get",
    async (session?: Session) => {
      return budgetRepository.getAll(session?.user?.id);
    },
  );
}

export async function addBudgetServerAction(
  prevState: { success: boolean } | null,
  formData: FormData,
): Promise<ServerActionResult> {
  const action = async (session?: Session) => {
    const budgetModel = getBudgetModel(formData);
    if (!budgetModel || !budgetModel.category || !budgetModel.maximum) {
      throw new CustomError("Invalid data: category and maximum are required");
    }

    const userId = session?.user?.id;

    const isCategoryUnique = await budgetRepository.isCategoryUnique(
      budgetModel.category,
      budgetModel.id,
      userId,
    );

    if (!isCategoryUnique) {
      throw new CustomError("Budget with such category already exist");
    }

    await budgetRepository.create({
      data: {
        category: budgetModel.category,
        maximum: budgetModel.maximum,
        theme: budgetModel.theme as Theme,
        userId,
      },
    });

    syncChanges();
    return true;
  };

  return await validationObjectWrapper<boolean>(
    "get",
    async (session?: Session) => action(session),
  );
}

export async function editBudgetServerAction(
  prevState: { success: boolean } | null,
  formData: FormData,
): Promise<ServerActionResult> {
  const action = async (session?: Session) => {
    const budgetModel = getBudgetModel(formData);
    if (!budgetModel || !budgetModel.id) {
      throw new CustomError("ID is required for update");
    }

    if (!Object.keys(budgetModel).length) {
      throw new CustomError("No changes to apply");
    }

    const userId = session?.user?.id;

    const isCategoryUnique = await budgetRepository.isCategoryUnique(
      budgetModel.category,
      budgetModel.id,
      userId,
    );

    if (!isCategoryUnique) {
      throw new CustomError("Budget with such category already exist");
    }

    await budgetRepository.update({
      where: { id: budgetModel.id },
      data: {
        category: budgetModel.category,
        maximum: budgetModel.maximum,
        theme: budgetModel.theme as Theme,
      },
    });
    syncChanges();
    return true;
  };

  return await validationObjectWrapper<boolean>(
    "update",
    async (session?: Session) => action(session),
  );
}

export async function deleteBudgetServerAction(
  id: string,
): Promise<ServerActionResult> {
  if (!id) {
    return { success: false, error: "ID is required" };
  }
  return await validationObjectWrapper<void>("delete", async () => {
    await budgetRepository.delete({
      where: { id },
    });
    syncChanges();
  });
}

function getBudgetModel(formData: FormData): Partial<Budget> | null {
  if (!formData) {
    return null;
  }

  const budgetModel: Partial<Budget> = {
    category: formData.get("budgetCategory") as
      | TransactionUICategory
      | undefined,
    maximum: Number(
      formData.get("maximum")?.toString()?.replaceAll(" ", "") || 0,
    ),
    theme: (formData.get("theme") as Theme) || Theme.NavyGrey,
    userId: formData.get("userId") as string | null,
    id: formData.get("id") as string | undefined,
  };

  if (budgetModel.category === TransactionUICategory.AllTransactions) {
    return null;
  }

  Object.keys(budgetModel).forEach(
    (key) =>
      budgetModel[key as keyof Partial<Budget>] === undefined &&
      delete budgetModel[key as keyof Partial<Budget>],
  );

  return budgetModel;
}

function syncChanges() {
  revalidatePath("/budgets");
}
