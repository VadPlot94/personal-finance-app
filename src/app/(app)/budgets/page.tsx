import { getAllBudgetsSRF } from "@/back-end/server-actions/budget-actions";
import { getTransactionsMonthlyExpensesByCategorySRF } from "@/back-end/server-actions/transaction-actions";
import Budgets from "@/front-end/components/budgets/budgets";

export default async function BudgetsPage() {
  const budgetsResponse = await getAllBudgetsSRF();
  const { data } = await getTransactionsMonthlyExpensesByCategorySRF();

  return (
    <Budgets
      budgets={budgetsResponse?.data}
      transactionsByCategoryList={data}
    />
  );
}
