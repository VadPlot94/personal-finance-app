"use server";

import { transactionRepository } from "@/back-end/DAL/repositories/transaction.repository";
import {
  IGetTransactionForCategoryParams,
  IGetTransactionsParams,
  ServerActionResult,
} from "./types";
import constants, {
  SortBy,
  sortByPrismaMap,
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";
import { revalidatePath } from "next/cache";
import {
  ITransactionDataResponse,
  ITransactionsForCategoryData,
} from "@/back-end/DAL/repositories/types";
import { Transaction } from "@prisma/client";
import { validationObjectWrapper } from "./common";
import { Session } from "next-auth";
import authService from "../DAL/db-services/auth.service";

export async function createTransactionServerAction(
  prevState: { success: boolean } | null,
  formData: FormData,
): Promise<ServerActionResult<Transaction>> {
  const newTransactionModel = getNewTransactionModel(formData);
  return await validationObjectWrapper<Transaction>(
    "create",
    async (session?: Session) => {
      const data = await transactionRepository.createTransaction({
        ...newTransactionModel,
        userId: session?.user?.id,
      });
      syncChanges();
      return data;
    },
  );
}

export async function getTransactionsServerAction(
  data?: Partial<IGetTransactionsParams>,
): Promise<ServerActionResult<ITransactionDataResponse>> {
  return await validationObjectWrapper<ITransactionDataResponse>(
    "get",
    async (session?: Session) => {
      const transactionModel = getTransactionsModel(data);
      return await transactionRepository.getTransactions({
        ...transactionModel,
        userId: session?.user?.id,
      });
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
        session?.user?.id,
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
    const session = await authService.getAuthenticatedSession();
    const categoryPromises = (data?.categories ?? []).map(async (category) => {
      const response = await transactionRepository.getTransactions(
        getTransactionsModel({
          category,
          transactionsCount: data?.transactionsCount || 3,
          userId: session.user.id,
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

function getNewTransactionModel(
  data: FormData,
): Required<Omit<Transaction, "id" | "userId">> {
  const mark = data.get("transactionType") === TransactionType.Income ? 1 : -1;
  const date = data.get("date")?.toString();
  return {
    amount: mark * +(data.get("amount")?.toString()?.replaceAll(" ", "") || 0),
    avatar:
      (data.get("avatar") as string) ??
      `./${constants.DefaultUserAvatarIconUrl}`,
    category: data.get("category") as string,
    date: date ? new Date(date) : new Date(),
    name: data.get("recipientOrSender") as string,
    recurring: false,
  };
}

function getTransactionsModel(
  data: Partial<IGetTransactionsParams> | undefined,
): IGetTransactionsParams {
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
    isRecurring: data?.isRecurring || false,
  };
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
