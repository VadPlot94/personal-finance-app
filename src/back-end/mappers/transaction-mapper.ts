import "server-only";
import type { Transaction } from "@prisma/client";
import type {
  ICreateTransactionDTOInput,
  ICreateTransactionDTOOutput,
} from "@/back-end/dto-model-types/transaction-dto-model.type";
import { removeUndefinedFields } from "@/lib/utils";
import constants, {
  SortBy,
  sortByPrismaMap,
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";
import type {
  IGetTransactionForCategoryParams,
  IGetTransactionsParams,
  ITransactionDataResponse,
  ITransactionsForCategoryData,
} from "@/shared/services/types";

class TransactionMapper {
  public mapCreateTransactionInputToDBTransaction(
    input: ICreateTransactionDTOInput,
  ): Partial<Transaction> | null {
    return this.getCreateTransactionModel(input);
  }

  public mapGetTransactionsInputToDBTransactionsParams(
    data: Partial<IGetTransactionsParams> | undefined,
  ): IGetTransactionsParams {
    return this.getTransactionsParams(data);
  }

  public mapGetTransactionsForCategoryInputToParams(
    data: Partial<IGetTransactionForCategoryParams>,
  ): { categories: string[]; transactionsCount: number } {
    const categories = (data?.categories ?? []).filter(
      (c) => c !== TransactionUICategory.AllTransactions,
    );
    const transactionsCount = data?.transactionsCount || 3;

    return { categories, transactionsCount };
  }

  public mapCreateDBTransactionToOutput(
    transaction: Transaction,
  ): ICreateTransactionDTOOutput {
    return { id: transaction.id };
  }

  public mapGetTransactionsToOutput(
    response: ITransactionDataResponse,
  ): ITransactionDataResponse {
    return response;
  }

  public mapMonthlyExpensesByCategoryToOutput(
    expenses: Transaction[],
  ): ITransactionsForCategoryData[] {
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

  public mapGetTransactionsForCategoryToOutput(
    items: ITransactionsForCategoryData[],
  ): ITransactionsForCategoryData[] {
    return items;
  }

  private getCreateTransactionModel(
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
    const recipientOrSender =
      formData.get("recipientOrSender")?.toString() || "";
    const dateValue = formData.get("date")?.toString();

    const transactionModel: Partial<Transaction> = {
      amount:
        (transactionType === TransactionType.Income ? 1 : -1) *
        Number(rawAmount),
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

  private getTransactionsParams(
    data: Partial<IGetTransactionsParams> | undefined,
  ): IGetTransactionsParams {
    const [sortByField, orderField] = Object.entries(
      sortByPrismaMap[data?.sortBy ?? SortBy.Latest],
    )[0] as [keyof typeof sortByPrismaMap, "asc" | "desc"];

    return {
      page: data?.page || 1,
      transactionsCount:
        data?.transactionsCount || constants.TransactionRecordsPerPage,
      sortBy: sortByField,
      order: orderField,
      category:
        data?.category &&
        data?.category !== TransactionUICategory.AllTransactions
          ? data?.category
          : undefined,
      search: data?.search as string,
      isRecurring: data?.isRecurring || false,
    };
  }
}

const transactionMapper = new TransactionMapper();
export default transactionMapper;
