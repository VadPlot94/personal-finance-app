"use server";
import "server-only";

import transactionController from "@/back-end/controllers/transaction-controller";
import type {
  IGetTransactionForCategoryParams,
  IGetTransactionsParams,
} from "@/shared/services/types";

export async function createTransactionSRF(
  _prevState: { success: boolean } | null,
  formData: FormData,
) {
  return transactionController.createTransaction(_prevState, formData);
}

export async function getAllTransactionsSRF(
  data?: Partial<IGetTransactionsParams>,
) {
  return transactionController.getAllTransactions(data);
}

export async function getTransactionsMonthlyExpensesByCategorySRF() {
  return transactionController.getTransactionsMonthlyExpensesByCategory();
}

export async function getTransactionsForCategorySRF(
  data?: Partial<IGetTransactionForCategoryParams>,
) {
  return transactionController.getTransactionsForCategory(data);
}
