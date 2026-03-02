import Budgets from "@/components/budgets/budgets";
import { getAllBudgetsServerAction } from "@/server-actions/budget-actions";
import { getTransactionsMonthlyExpensesByCategoryServerAction } from "@/server-actions/transaction-actions";

export default async function BudgetsPage() {
  const budgetsResponse = await getAllBudgetsServerAction();
  const { data } = await getTransactionsMonthlyExpensesByCategoryServerAction();

  return (
    <Budgets
      budgets={budgetsResponse?.data}
      transactionsByCategoryList={data}
    />
  );
}
