import "server-only";
import type { Balance } from "@prisma/client";
import type { IBalanceDTOOutput } from "@/back-end/dto-model-types/balance-dto-model.type";

class BalanceMapper {
  public mapBalanceToOutput(balance: Balance): IBalanceDTOOutput {
    return {
      id: balance.id,
      current: balance.current,
      income: balance.income,
      expenses: balance.expenses,
    };
  }
}

const balanceMapper = new BalanceMapper();
export default balanceMapper;
