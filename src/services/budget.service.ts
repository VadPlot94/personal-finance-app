import { Transaction } from "@prisma/client";
import potService from "./pot.service";
import financeService from "./finance.service";

class BudgetService {
  public getBudgetPercentageData(
    maximum: number,
    transactions: Transaction[] | undefined,
  ) {
    const spent = Math.abs(
      transactions?.reduce((acc, transaction) => acc + transaction.amount, 0) ??
        0,
    );
    const remaining = maximum - spent;
    const percentBarProgress = financeService.calculateProgressPercentage(
      spent,
      maximum,
    );
    return {
      spent,
      remaining,
      percentBarProgress,
    };
  }
}

const budgetService = new BudgetService();
export default budgetService;
