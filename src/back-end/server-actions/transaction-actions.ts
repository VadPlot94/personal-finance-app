"use server";

import {
  createTransaction,
  getTransactions,
} from "@/back-end/DAL/db-services/transaction-db.service";
import {
  IGetTransactionForCategoryParams,
  IGetTransactionsParams,
  ServerActionResult,
} from "./types";
import { Transaction } from "@prisma/client";
import { updateBalanceFromTransactionServerAction } from "@/back-end/server-actions/balance-actions";
import constants, {
  TransactionUICategory,
  TransactionType,
} from "@/shared/services/constants.service";
import { revalidatePath } from "next/cache";
import {
  ITransactionDataResponse,
  ITransactionsForCategoryData,
} from "@/back-end/DAL/repositories/types";
import { ICreateTransactionDTOOutput } from "@/back-end/dto-models/transaction-dto.model";
import { validationObjectWrapper } from "./common";
import { Session } from "next-auth";
import authService from "../DAL/db-services/auth.service";
import { transactionRepository } from "@/back-end/DAL/repositories/transaction.repository";

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
      const expenses = await transactionRepository.getMonthlyExpensesByCategory(
        session?.user?.id!,
      );
      const result: Record<string, Transaction[]> = {};

      expenses.forEach((transaction) => {
        const category = transaction.category;
        if (!result[category]) {
          result[category] = [];
        }
        result[category].push(transaction);
      });

      return Object.entries(result).map(([category, transactions]) => ({
        category: category as TransactionUICategory,
        transactions,
      }));
    },
  );
}

export async function getTransactionsForCategoryServerAction(
  data?: Partial<IGetTransactionForCategoryParams>,
): Promise<ServerActionResult<ITransactionsForCategoryData[]>> {
  try {
    const session = await authService.getAuthenticatedSession();
    const categoryPromises = (data?.categories ?? []).map(async (category) => {
      const response = await getTransactions(
        {
          category,
          transactionsCount: data?.transactionsCount || 3,
        },
        session.user.id,
      );
      return { category, transactions: response.transactions } as const;
    });

    const resultsArray =
      await Promise.all<ITransactionsForCategoryData>(categoryPromises);

    return {
      success: true,
      data: resultsArray,
      message: "Transactions by category get successfully",
    };
  } catch (error) {
    console.error("Error getting transactions by category:", error);
    return {
      success: false,
      error: "Failed to get transactions by category. Please try again.",
    };
  }
}


export async function deleteRecurringServerAction(
  id: string,
): Promise<ServerActionResult> {
  try {
    if (!id) {
      return { success: false, error: "ID is required" };
    }

    // TODO: not sure that delete bill means delete transaction
    // await transactionRepository.delete({
    //   where: { id },
    // });

    syncChanges();

    return { success: true, message: "Recurring bill deleted successfully" };
  } catch (error) {
    console.error("Error deleting recurring bill:", error);
    return {
      success: false,
      error: "Failed to delete recurring bill. Please try again.",
    };
  }
}

function syncChanges() {
  revalidatePath("/transactions");
}
