import "server-only";

import type { Transaction } from "@prisma/client";
import { updateTag } from "next/cache";
import type { Session } from "next-auth";
import { BaseController } from "@/back-end/controllers/base-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";
import { balanceTag } from "@/back-end/DAL/cache/cache-tags";
import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import recurringDbService from "@/back-end/DAL/db-services/recurring-db.service";
import transactionDbService from "@/back-end/DAL/db-services/transaction-db.service";
import type {
  IGetTransactionsParams,
  ITransactionDataResponse,
} from "@/shared/services/types";

// Recurring lists are not cached.
// Recurring auto-post inserts due bills during GET, and a Server Component cannot call updateTag.
// A `"use cache"` list would keep showing the old rows after Current had already been reduced.

class RecurringController extends BaseController {
  public async getAllRecurring(
    data?: Partial<IGetTransactionsParams>,
  ): Promise<ValidationResponse<ITransactionDataResponse>> {
    return await this.validationObjectWrapper<ITransactionDataResponse>(
      "get",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        await recurringDbService.materializeDueBills(userId);
        return transactionDbService.getAllTransactions(
          { ...data, isRecurring: true },
          userId,
        );
      },
    );
  }

  public async getRecurringExpenses(): Promise<
    ValidationResponse<Transaction[]>
  > {
    return await this.validationObjectWrapper<Transaction[]>(
      "get",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        await recurringDbService.materializeDueBills(userId);
        return transactionDbService.getRecurringExpenses(userId);
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
    updateTag(balanceTag(userId));
  }
}

const recurringController = new RecurringController();
export default recurringController;
