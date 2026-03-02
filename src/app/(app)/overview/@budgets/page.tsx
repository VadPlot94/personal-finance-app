import BudgetsTile from "@/components/budgets/budgets-tile";
import { getAllBudgetsServerAction } from "@/server-actions/budget-actions";
import { getTransactionsMonthlyExpensesByCategoryServerAction } from "@/server-actions/transaction-actions";

export default async function BudgetsTilePage() {
  const budgetsResponse = await getAllBudgetsServerAction();
  const { data } = await getTransactionsMonthlyExpensesByCategoryServerAction();
  return (
    <BudgetsTile
      budgets={budgetsResponse?.data}
      transactionsByCategoryList={data}
    />
  );
}
