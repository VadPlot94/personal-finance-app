"use server";
import "server-only";

import { revalidatePath } from "next/cache";
import type { Session } from "next-auth";
import {
  getBalance,
  updateBalanceForTransaction,
} from "@/back-end/DAL/db-services/balance-db.service";
import type { IBalanceDTOOutput } from "@/back-end/dto-models/balance-dto.model";
import { validationObjectWrapper } from "@/back-end/server-actions/common";
import type { ServerActionResult } from "@/back-end/server-actions/types";

export async function getBalanceServerAction(): Promise<
  ServerActionResult<IBalanceDTOOutput>
> {
  const validatedResponse = await validationObjectWrapper<IBalanceDTOOutput>(
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

  return validatedResponse;
}

export async function updateBalanceFromTransactionServerAction(
  amount: number,
): Promise<ServerActionResult<IBalanceDTOOutput>> {
  const validatedResponse = await validationObjectWrapper<IBalanceDTOOutput>(
    "update",
    async (session?: Session) => {
      const balance = await updateBalanceForTransaction(
        session?.user?.id!,
        amount,
      );
      return {
        id: balance.id,
        current: balance.current,
        income: balance.income,
        expenses: balance.expenses,
      };
    },
  );

  syncChanges();
  return validatedResponse;
}

function syncChanges() {
  revalidatePath("/overview");
}
