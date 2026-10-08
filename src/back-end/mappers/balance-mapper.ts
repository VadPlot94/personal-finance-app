import "server-only";
import type { Balance } from "@prisma/client";
import type { IBalanceDTOOutput } from "@/back-end/dto-models/balance-dto.model";

export function mapBalanceToOutput(balance: Balance): IBalanceDTOOutput {
  return {
    id: balance.id,
    current: balance.current,
    income: balance.income,
    expenses: balance.expenses,
  };
}
