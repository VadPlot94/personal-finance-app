"use server";

import {
  createTransaction,
  getTransactions,
  getMonthlyExpensesByCategory,
  getTransactionsForCategory,
  deleteRecurring,
} from "@/back-end/DAL/db-services/transaction-db.service";
import {
  IGetTransactionForCategoryParams,
  IGetTransactionsParams,
  ServerActionResult,
} from "./types";
import { updateBalanceFromTransactionServerAction } from "@/back-end/server-actions/balance-actions";
import { revalidatePath } from "next/cache";
import {
  ITransactionDataResponse,
  ITransactionsForCategoryData,
} from "@/back-end/DAL/repositories/types";
import { ICreateTransactionDTOOutput } from "@/back-end/dto-models/transaction-dto.model";
import { validationObjectWrapper } from "./common";
import { Session } from "next-auth";

export async function createTransactionServerAction(
  prevState: { success: boolean } | null,
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
      return await getTransactionsForCategory(data as any, session?.user?.id!);
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
