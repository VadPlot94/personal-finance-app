import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { Session } from "next-auth";
import { BaseController } from "@/back-end/controllers/base-controller";
import type { ValidationResponse } from "@/back-end/controllers/types";
import { balanceTag } from "@/back-end/DAL/cache/cache-tags";
import balanceDbService from "@/back-end/DAL/db-services/balance-db.service";
import type { IBalanceDTOOutput } from "@/back-end/dto-model-types/balance-dto-model.type";

async function getBalanceCached(userId: string): Promise<IBalanceDTOOutput> {
  "use cache";
  cacheTag(balanceTag(userId));
  cacheLife("minutes");
  return balanceDbService.getBalance(userId);
}

class BalanceController extends BaseController {
  public async getBalance(): Promise<ValidationResponse<IBalanceDTOOutput>> {
    return await this.validationObjectWrapper<IBalanceDTOOutput>(
      "get",
      async (session?: Session) => {
        return getBalanceCached(session?.user?.id!);
      },
    );
  }
}

const balanceController = new BalanceController();
export default balanceController;
