"use server";
import "server-only";

import transactionController from "@/back-end/controllers/transaction-controller";
import type { IGetTransactionsParams } from "@/shared/services/types";

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
