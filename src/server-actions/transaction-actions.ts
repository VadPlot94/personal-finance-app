"use server";

import { transactionRepository } from "@/repositories/transaction.repository";
import {
  IGetTransactionForCategoryParams,
  IGetTransactionsParams,
  ServerActionResult,
} from "./types";
import constants, {
  SortBy,
  sortByPrismaMap,
  TransactionUICategory,
} from "@/services/constants.service";
import { revalidatePath } from "next/cache";
import {
  ITransactionDataResponse,
  ITransactionsForCategoryData,
} from "@/repositories/types";
import { Transaction } from "@prisma/client";
import { validationObjectWrapper } from "./common";

export async function getTransactionsServerAction(
  data?: Partial<IGetTransactionsParams>,
): Promise<ServerActionResult<ITransactionDataResponse>> {
  return await validationObjectWrapper<ITransactionDataResponse>(
    "get",
    async () =>
      transactionRepository.getTransactions(getTransactionsModel(data)),
  );
}

export async function getTransactionsMonthlyExpensesByCategoryServerAction(): Promise<
  ServerActionResult<ITransactionsForCategoryData[]>
> {
  return await validationObjectWrapper<ITransactionsForCategoryData[]>(
    "get",
    async () => {
      const expenses = await transactionRepository.getMonthlyExpensesByCategory(
        null as any,
      );
      const result: { [s: string]: Transaction[] } = {};

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
    const categoryPromises = (data?.categories ?? []).map(async (category) => {
      const response = await transactionRepository.getTransactions(
        getTransactionsModel({
          category,
          transactionsCount: data?.transactionsCount || 3,
        }),
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

function getTransactionsModel(
  data: Partial<IGetTransactionsParams> | undefined,
): Required<IGetTransactionsParams> {
  const [sortByField, orderField] = Object.entries(
    sortByPrismaMap[data?.sortBy || SortBy.Latest],
  )[0];
  return {
    page: data?.page || 1,
    transactionsCount:
      data?.transactionsCount || constants.TransactionRecordsPerPage,
    sortBy: sortByField as SortBy,
    order: orderField,
    category: (data?.category &&
    data?.category !== TransactionUICategory.AllTransactions
      ? data?.category
      : null) as TransactionUICategory,
    search: data?.search as string,
  };
}

function syncChanges() {
  revalidatePath("/transactions");
}
