import { getAllBudgetsSRF } from "@/back-end/server-actions/budget-actions";
import { getTransactionsMonthlyExpensesByCategorySRF } from "@/back-end/server-actions/transaction-actions";
import BudgetsTile from "@/front-end/components/budgets/budgets-tile";

export default async function BudgetsTilePage() {
  const budgetsResponse = await getAllBudgetsSRF();
  const { data } = await getTransactionsMonthlyExpensesByCategorySRF();
  return (
    <BudgetsTile
      budgets={budgetsResponse?.data}
      transactionsByCategoryList={data}
    />
  );
}
