import BudgetsTile from "@/front-end/components/budgets/budgets-tile";
import { getAllBudgetsServerAction } from "@/back-end/server-actions/budget-actions";
import { getTransactionsMonthlyExpensesByCategoryServerAction } from "@/back-end/server-actions/transaction-actions";

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
