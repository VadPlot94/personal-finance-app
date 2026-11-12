import "server-only";

import { updateTag } from "next/cache";
import type { Session } from "next-auth";
import { BaseController } from "@/back-end/controllers/base-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";
import { balanceTag } from "@/back-end/DAL/cache/cache-tags";
import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import transactionDbService from "@/back-end/DAL/db-services/transaction-db.service";
import type { ICreateTransactionDTOOutput } from "@/back-end/dto-model-types/transaction-dto-model.type";
import type {
  IGetTransactionForCategoryParams,
  IGetTransactionsParams,
  ITransactionDataResponse,
  ITransactionsForCategoryData,
} from "@/shared/services/types";

// Transaction lists are not cached.
// Recurring auto-post inserts due bills during GET, and a Server Component cannot call updateTag.
// A `"use cache"` list would keep showing the old rows after Current had already been reduced.

class TransactionController extends BaseController {
  public async createTransaction(
    _prevState: { success: boolean } | null,
    formData: FormData,
  ): Promise<ValidationResponse<ICreateTransactionDTOOutput>> {
    return await this.validationObjectWrapper<ICreateTransactionDTOOutput>(
      "create",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        const transaction = await transactionDbService.createTransaction(
          formData,
          userId,
        );
        await balanceDbService.recalculateBalance(userId);
        this.syncChanges(userId);
        return transaction;
      },
    );
  }

  public async getAllTransactions(
    data?: Partial<IGetTransactionsParams>,
  ): Promise<ValidationResponse<ITransactionDataResponse>> {
    return await this.validationObjectWrapper<ITransactionDataResponse>(
      "get",
      async (session?: Session) => {
        return await transactionDbService.getAllTransactions(
          data,
          session?.user?.id!,
        );
      },
    );
  }

  public async getTransactionsMonthlyExpensesByCategory(): Promise<
    ValidationResponse<ITransactionsForCategoryData[]>
  > {
    return await this.validationObjectWrapper<ITransactionsForCategoryData[]>(
      "get",
      async (session?: Session) => {
        return await transactionDbService.getMonthlyExpensesByCategory(
          session?.user?.id!,
        );
      },
    );
  }

  public async getTransactionsForCategory(
    data?: Partial<IGetTransactionForCategoryParams>,
  ): Promise<ValidationResponse<ITransactionsForCategoryData[]>> {
    return await this.validationObjectWrapper<ITransactionsForCategoryData[]>(
      "get",
      async (session?: Session) => {
        return await transactionDbService.getTransactionsForCategory(
          data,
          session?.user?.id!,
        );
      },
    );
  }

  private syncChanges(userId: string) {
    updateTag(balanceTag(userId));
  }
}

const transactionController = new TransactionController();
export default transactionController;
