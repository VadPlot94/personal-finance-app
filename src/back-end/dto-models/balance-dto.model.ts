import "server-only";
import { Balance } from "@prisma/client";

export type IGetBalanceDTOInput = void;

export interface IBalanceDTOOutput {
  id: string;
  current: number;
  income: number;
  expenses: number;
}

export function mapBalanceToOutput(balance: Balance): IBalanceDTOOutput {
  return {
    id: balance.id,
    current: balance.current,
    income: balance.income,
    expenses: balance.expenses,
  };
}
