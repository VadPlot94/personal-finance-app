"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import type { Session } from "next-auth";
import {
  createTransaction,
  deleteRecurring,
  getMonthlyExpensesByCategory,
  getTransactions,
  getTransactionsForCategory,
} from "@/back-end/DAL/db-services/transaction-db.service";
import type { ICreateTransactionDTOOutput } from "@/back-end/dto-models/transaction-dto.model";
import { updateBalanceFromTransactionServerAction } from "@/back-end/server-actions/balance-actions";
import { validationObjectWrapper } from "@/back-end/server-actions/common";
import type { ServerActionResult } from "@/back-end/server-actions/types";
import type {
  IGetTransactionForCategoryParams,
  IGetTransactionsParams,
  ITransactionDataResponse,
  ITransactionsForCategoryData,
} from "@/shared/services/types";

export async function createTransactionServerAction(
  _prevState: { success: boolean } | null,
  formData: FormData,
): Promise<ServerActionResult<ICreateTransactionDTOOutput>> {
  return await validationObjectWrapper<ICreateTransactionDTOOutput>(
    "create",
    async (session?: Session) => {
      const transaction = await createTransaction(formData, session?.user?.id!);
      await updateBalanceFromTransactionServerAction(transaction.amount);
      syncChanges();
      return { id: transaction.id };
    },
  );
}

export async function getTransactionsServerAction(
  data?: Partial<IGetTransactionsParams>,
): Promise<ServerActionResult<ITransactionDataResponse>> {
  return await validationObjectWrapper<ITransactionDataResponse>(
    "get",
    async (session?: Session) => {
      return await getTransactions(data, session?.user?.id!);
    },
  );
}

export async function getTransactionsMonthlyExpensesByCategoryServerAction(): Promise<
  ServerActionResult<ITransactionsForCategoryData[]>
> {
  return await validationObjectWrapper<ITransactionsForCategoryData[]>(
    "get",
    async (session?: Session) => {
      return await getMonthlyExpensesByCategory(session?.user?.id!);
    },
  );
}

export async function getTransactionsForCategoryServerAction(
  data?: Partial<IGetTransactionForCategoryParams>,
): Promise<ServerActionResult<ITransactionsForCategoryData[]>> {
  return await validationObjectWrapper<ITransactionsForCategoryData[]>(
    "get",
    async (session?: Session) => {
      return await getTransactionsForCategory(data, session?.user?.id!);
    },
  );
}

export async function deleteRecurringServerAction(
  id: string,
): Promise<ServerActionResult> {
  return await validationObjectWrapper<boolean>(
    "delete",
    async (session?: Session) => {
      const result = await deleteRecurring(id, session?.user?.id!);
      syncChanges();
      return result;
    },
  );
}

function syncChanges() {
  revalidatePath("/transactions");
}
