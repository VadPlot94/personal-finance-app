import type { IBalanceComputed } from "@/shared/services/types";

class BalanceService {
  public computeFromSums(income: number, expenses: number): IBalanceComputed {
    const safeIncome = Number.isFinite(income) ? income : 0;
    const safeExpenses = Number.isFinite(expenses) ? expenses : 0;
    return {
      income: safeIncome,
      expenses: safeExpenses,
      current: safeIncome - safeExpenses,
    };
  }

  public computeAvailable(current: number, potsTotal: number): number {
    const safeCurrent = Number.isFinite(current) ? current : 0;
    const safePots = Number.isFinite(potsTotal) ? potsTotal : 0;
    return safeCurrent - safePots;
  }
}

const balanceService = new BalanceService();
export default balanceService;
