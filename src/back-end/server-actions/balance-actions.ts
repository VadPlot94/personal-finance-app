"use server";
import "server-only";

import type { Session } from "next-auth";
import { getBalance } from "@/back-end/DAL/db-services/balance-db.service";
import type { IBalanceDTOOutput } from "@/back-end/dto-models/balance-dto.model";
import { validationObjectWrapper } from "@/back-end/server-actions/common";
import type { ServerActionResult } from "@/back-end/server-actions/types";

export async function getBalanceServerAction(): Promise<
  ServerActionResult<IBalanceDTOOutput>
> {
  return await validationObjectWrapper<IBalanceDTOOutput>(
    "get",
    async (session?: Session) => {
      const balance = await getBalance(session?.user?.id!);
      return {
        id: balance.id,
        current: balance.current,
        income: balance.income,
        expenses: balance.expenses,
      };
    },
  );
}
