import "server-only";
import type { Transaction } from "@prisma/client";
import { throwValidationError } from "@/back-end/common/errors";
import { transactionRepository } from "@/back-end/DAL/repositories/transaction.repository";
import type {
  ICreateTransactionDTOInput,
  ICreateTransactionDTOOutput,
} from "@/back-end/dto-model-types/transaction-dto-model.type";
import transactionMapper from "@/back-end/mappers/transaction-mapper";
import type {
  TransactionType,
  TransactionUICategory,
} from "@/shared/services/constants.service";
import type {
  IGetTransactionsParams,
  ITransactionDataResponse,
  ITransactionsForCategoryData,
} from "@/shared/services/types";
import validationService from "@/shared/services/validation.service";

class TransactionDbService {
  public async getAllTransactions(
    data: Partial<IGetTransactionsParams> | undefined,
    userId: string,
  ): Promise<ITransactionDataResponse> {
    const response = await transactionRepository.getAllTransactions({
      ...transactionMapper.mapGetTransactionsInputToDBTransactionsParams(data),
      userId,
    });

    return transactionMapper.mapGetTransactionsToOutput(response);
  }

  public async getMonthlyExpensesByCategory(
    userId: string,
  ): Promise<ITransactionsForCategoryData[]> {
    const expenses =
      await transactionRepository.getMonthlyExpensesByCategory(userId);

    return transactionMapper.mapMonthlyExpensesByCategoryToOutput(expenses);
  }

  public async createTransaction(
    formData: ICreateTransactionDTOInput,
    userId: string,
  ): Promise<ICreateTransactionDTOOutput> {
    this.validateCreateTransactionFormData(formData);

    const transactionModel =
      transactionMapper.mapCreateTransactionInputToDBTransaction(
        formData,
      ) as Omit<Transaction, "id">;

    const response = await transactionRepository.createTransaction({
      ...transactionModel,
      userId,
    });

    return transactionMapper.mapCreateDBTransactionToOutput(response);
  }

  public async deleteRecurring(
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

  public async getTransactionsForCategory(
    data: Partial<IGetTransactionsParams> | undefined,
    userId: string,
  ): Promise<ITransactionsForCategoryData[]> {
    const { categories, transactionsCount } =
      transactionMapper.mapGetTransactionsForCategoryInputToParams(data!);

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
      const response = await this.getAllTransactions(
        { category, transactionsCount } as Partial<IGetTransactionsParams>,
        userId,
      );
      return {
        category: category as TransactionUICategory,
        transactions: response.transactions,
      } as ITransactionsForCategoryData;
    });

    const items = await Promise.all(categoryPromises);
    return transactionMapper.mapGetTransactionsForCategoryToOutput(items);
  }

  private validateCreateTransactionFormData(
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
}

const transactionDbService = new TransactionDbService();
export default transactionDbService;
