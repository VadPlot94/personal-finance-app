import "server-only";

import { cacheLife, cacheTag, updateTag } from "next/cache";
import type { Session } from "next-auth";
import { BaseController } from "@/back-end/controllers/base-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";
import { balanceTag, transactionsTag } from "@/back-end/DAL/cache/cache-tags";
import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import transactionDbService from "@/back-end/DAL/db-services/transaction-db.service";
import type {
  IGetTransactionsParams,
  ITransactionDataResponse,
} from "@/shared/services/types";

async function getAllRecurringCached(
  data: Partial<IGetTransactionsParams> | undefined,
  userId: string,
): Promise<ITransactionDataResponse> {
  "use cache";
  cacheTag(transactionsTag(userId));
  cacheLife("minutes");
  return transactionDbService.getAllTransactions(
    { ...data, isRecurring: true },
    userId,
  );
}

class RecurringController extends BaseController {
  public async getAllRecurring(
    data?: Partial<IGetTransactionsParams>,
  ): Promise<ValidationResponse<ITransactionDataResponse>> {
    return await this.validationObjectWrapper<ITransactionDataResponse>(
      "get",
      async (session?: Session) => {
        return await getAllRecurringCached(data, session?.user?.id!);
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

const recurringController = new RecurringController();
export default recurringController;
