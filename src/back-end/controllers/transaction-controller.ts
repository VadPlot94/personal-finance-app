import "server-only";

import { cacheLife, cacheTag, updateTag } from "next/cache";
import type { Session } from "next-auth";
import { BaseController } from "@/back-end/controllers/base-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";
import { balanceTag, transactionsTag } from "@/back-end/DAL/cache/cache-tags";
import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import transactionDbService from "@/back-end/DAL/db-services/transaction-db.service";
import type { ICreateTransactionDTOOutput } from "@/back-end/dto-model-types/transaction-dto-model.type";
import type {
  IGetTransactionForCategoryParams,
  IGetTransactionsParams,
  ITransactionDataResponse,
  ITransactionsForCategoryData,
} from "@/shared/services/types";

async function getTransactionsCached(
  data: Partial<IGetTransactionsParams> | undefined,
  userId: string,
): Promise<ITransactionDataResponse> {
  "use cache";
  cacheTag(transactionsTag(userId));
  cacheLife("minutes");
  return transactionDbService.getTransactions(data, userId);
}

async function getMonthlyExpensesByCategoryCached(
  userId: string,
): Promise<ITransactionsForCategoryData[]> {
  "use cache";
  cacheTag(transactionsTag(userId));
  cacheLife("minutes");
  return transactionDbService.getMonthlyExpensesByCategory(userId);
}

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
        await balanceDbService.updateBalanceForTransaction(userId, 0);
        this.syncChanges(userId);
        return transaction;
      },
    );
  }

  public async getTransactions(
    data?: Partial<IGetTransactionsParams>,
  ): Promise<ValidationResponse<ITransactionDataResponse>> {
    return await this.validationObjectWrapper<ITransactionDataResponse>(
      "get",
      async (session?: Session) => {
        return await getTransactionsCached(data, session?.user?.id!);
      },
    );
  }

  public async getTransactionsMonthlyExpensesByCategory(): Promise<
    ValidationResponse<ITransactionsForCategoryData[]>
  > {
    return await this.validationObjectWrapper<ITransactionsForCategoryData[]>(
      "get",
      async (session?: Session) => {
        return await getMonthlyExpensesByCategoryCached(session?.user?.id!);
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

  public async deleteRecurring(id: string): Promise<ValidationResponse> {
    return await this.validationObjectWrapper<boolean>(
      "delete",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        const result = await transactionDbService.deleteRecurring(id, userId);
        await balanceDbService.recalculateBalance(userId);
        this.syncChanges(userId);
        return result;
      },
    );
  }

  private syncChanges(userId: string) {
    updateTag(transactionsTag(userId));
    updateTag(balanceTag(userId));
  }
}

const transactionController = new TransactionController();
export default transactionController;
