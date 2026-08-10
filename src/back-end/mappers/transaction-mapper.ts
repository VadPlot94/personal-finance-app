import { Transaction } from "@prisma/client";
import { ICreateTransactionDTOInput } from "@/back-end/dto-models/transaction-dto.model";
import {
  IGetTransactionsParams,
  IGetTransactionForCategoryParams,
} from "@/back-end/server-actions/types";
import constants, {
  SortBy,
  TransactionType,
  TransactionUICategory,
  sortByPrismaMap,
} from "@/shared/services/constants.service";
import { removeUndefinedFields } from "@/lib/utils";

export function mapCreateTransactionInputToDBTransaction(
  input: ICreateTransactionDTOInput,
): Partial<Transaction> | null {
  return getCreateTransactionModel(input);
}

export function mapGetTransactionsInputToDBTransactionsParams(
  data: Partial<IGetTransactionsParams> | undefined,
): IGetTransactionsParams {
  return getTransactionsParams(data);
}

export function mapGetTransactionsForCategoryInputToParams(
  data: Partial<IGetTransactionForCategoryParams> | undefined,
): { categories: string[]; transactionsCount: number } {
  const categories = (data?.categories ?? []).filter(
    (c) => c !== TransactionUICategory.AllTransactions,
  );
  const transactionsCount = data?.transactionsCount || 3;

  return { categories, transactionsCount };
}

export function mapCreateDBTransactionToOutput(transaction: Transaction): {
  id: string;
} {
  return { id: transaction.id };
}

function getCreateTransactionModel(
  formData: ICreateTransactionDTOInput,
): Partial<Transaction> | null {
  if (!formData) {
    return null;
  }

  const rawAmount =
    formData.get("amount")?.toString()?.replaceAll(" ", "") || "0";
  const transactionType = formData.get("transactionType")?.toString() as
    | TransactionType
    | undefined;
  const category = formData.get("category")?.toString() || "";
  const recipientOrSender = formData.get("recipientOrSender")?.toString() || "";
  const dateValue = formData.get("date")?.toString();

  const transactionModel: Partial<Transaction> = {
    amount:
      (transactionType === TransactionType.Income ? 1 : -1) * Number(rawAmount),
    avatar:
      formData.get("avatar")?.toString() ||
      `./${constants.DefaultUserAvatarIconUrl}`,
    category,
    date: dateValue ? new Date(dateValue) : new Date(),
    name: recipientOrSender,
    recurring: false,
  };

  return removeUndefinedFields(transactionModel);
}

export function getTransactionsParams(
  data: Partial<IGetTransactionsParams> | undefined,
): IGetTransactionsParams {
  const [sortByField, orderField] = Object.entries(
    sortByPrismaMap[data?.sortBy ?? SortBy.Latest],
  )[0] as [keyof typeof sortByPrismaMap, "asc" | "desc"];

  return {
    page: data?.page || 1,
    transactionsCount:
      data?.transactionsCount || constants.TransactionRecordsPerPage,
    sortBy: sortByField as any,
    order: orderField,
    category:
      data?.category && data?.category !== TransactionUICategory.AllTransactions
        ? data?.category
        : undefined,
    search: data?.search as string,
    isRecurring: data?.isRecurring || false,
  };
}
