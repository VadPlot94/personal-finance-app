"use server";

import { transactionRepository } from "@/repositories/transaction.repository";
import { IGetTransactionsParams, ServerActionResult } from "./types";
import constants, {
  SortBy,
  sortByDataBaseFieldMap,
  TransactionCategory,
} from "@/services/constants.service";
import { revalidatePath } from "next/cache";
import { ITransactionDataResponse } from "@/repositories/types";

export async function getTransactionsServerAction(
  data?: Partial<IGetTransactionsParams>,
): Promise<ServerActionResult<ITransactionDataResponse>> {
  try {
    const transactionsResponse: ITransactionDataResponse =
      await transactionRepository.getTransactions(getTransactionsModel(data));

    // syncChanges();
    return {
      success: true,
      data: transactionsResponse,
      message: "Transactions get successfully",
    };
  } catch (error) {
    console.error("Error getting transactions pot:", error);
    return {
      success: false,
      error: "Failed to get transactions. Please try again.",
    };
  }
}

function getTransactionsModel(
  data: Partial<IGetTransactionsParams> | undefined,
): Required<IGetTransactionsParams> {
  return {
    page: data?.page || 1,
    transactionsCount:
      data?.transactionsCount || constants.TransactionRecordsPerPage,
    sortBy: sortByDataBaseFieldMap[data?.sortBy || SortBy.Latest] as SortBy,
    order: "desc",
    category: (data?.category &&
    data?.category !== TransactionCategory.AllTransactions
      ? data?.category
      : null) as TransactionCategory,
  };
}

function syncChanges() {
  revalidatePath("/transactions");
}
