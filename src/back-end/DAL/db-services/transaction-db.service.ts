import "server-only";
import validationService from "@/shared/services/validation.service";
import { Transaction } from "@prisma/client";
import { transactionRepository } from "../repositories/transaction.repository";
import { throwValidationError } from "@/back-end/server-actions/common";
import {
  mapCreateTransactionInputToDBTransaction,
  mapGetTransactionsInputToDBTransactionsParams,
  mapGetTransactionsForCategoryInputToParams,
} from "@/back-end/mappers/transaction-mapper";
import { ICreateTransactionDTOInput } from "@/back-end/dto-models/transaction-dto.model";
import { IGetTransactionsParams } from "@/back-end/server-actions/types";
import {
  ITransactionDataResponse,
  ITransactionsForCategoryData,
} from "../repositories/types";
import {
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";

export async function getTransactions(
  data: Partial<IGetTransactionsParams> | undefined,
  userId: string,
): Promise<ITransactionDataResponse> {
  return await transactionRepository.getTransactions({
    ...mapGetTransactionsInputToDBTransactionsParams(data),
    userId,
  });
}

export async function getMonthlyExpensesByCategory(
  userId: string,
): Promise<ITransactionsForCategoryData[]> {
  const expenses =
    await transactionRepository.getMonthlyExpensesByCategory(userId);

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
}

export async function createTransaction(
  formData: ICreateTransactionDTOInput,
  userId: string,
): Promise<Transaction> {
  validateCreateTransactionFormData(formData);

  const transactionModel = mapCreateTransactionInputToDBTransaction(
    formData,
  ) as Omit<Transaction, "id">;

  const response = await transactionRepository.createTransaction({
    ...transactionModel,
    userId,
  });

  return response;
}

export async function deleteRecurring(
  id: string | null | undefined,
  userId: string,
): Promise<boolean> {
  if (!id) {
    const zodErrorResult = validationService.createCustomZodIssueResult(
      "id",
      "ID is required for delete",
    );
    throwValidationError(zodErrorResult);
  }

  const idStr = id as string;

  const deleted = await transactionRepository.deleteIfOwnedRecurring(
    idStr,
    userId,
  );

  if (!deleted) {
    const zodErrorResult = validationService.createCustomZodIssueResult(
      "id",
      "Transaction not found, not recurring",
    );
    throwValidationError(zodErrorResult);
  }

  return deleted;
}

export async function getTransactionsForCategory(
  data: Partial<IGetTransactionsParams> | undefined,
  userId: string,
): Promise<ITransactionsForCategoryData[]> {
  const { categories, transactionsCount } =
    mapGetTransactionsForCategoryInputToParams(data as any);

  if (!categories || categories.length === 0) {
    return [];
  }

  if (transactionsCount <= 0) {
    const zodErrorResult = validationService.createCustomZodIssueResult(
      "transactionsCount",
      "Transactions count must be greater than zero",
    );
    throwValidationError(zodErrorResult);
  }

  const categoryPromises = categories.map(async (category) => {
    const response = await getTransactions(
      { category, transactionsCount } as Partial<IGetTransactionsParams>,
      userId,
    );
    return {
      category,
      transactions: response.transactions,
    } as ITransactionsForCategoryData;
  });

  return await Promise.all(categoryPromises);
}

function validateCreateTransactionFormData(
  formData: ICreateTransactionDTOInput,
): void {
  const validationData = {
    transactionType: formData.get("transactionType") as
      | TransactionType
      | undefined,
    category: formData.get("category") as TransactionUICategory | undefined,
    recipientOrSender: formData.get("recipientOrSender")?.toString() || "",
    amount: formData.get("amount")?.toString() || "",
    date: formData.get("date")?.toString() || "",
  };

  const validationResult =
    validationService.validateCreateTransactionSchema(validationData);

  throwValidationError(validationResult);
}
