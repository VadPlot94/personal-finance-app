import "server-only";

import type { Session } from "next-auth";
import { BaseController } from "@/back-end/controllers/base-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";
import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import recurringDbService from "@/back-end/DAL/db-services/recurring-db.service";
import type { IBalanceDTOOutput } from "@/back-end/dto-model-types/balance-dto-model.type";

class BalanceController extends BaseController {
  public async getBalance(): Promise<ValidationResponse<IBalanceDTOOutput>> {
    return await this.validationObjectWrapper<IBalanceDTOOutput>(
      "get",
      async (session?: Session) => {
        const userId = session?.user?.id!;
        await recurringDbService.materializeDueBills(userId);
        return balanceDbService.getBalance(userId);
      },
    );
  }
}

const balanceController = new BalanceController();
export default balanceController;
