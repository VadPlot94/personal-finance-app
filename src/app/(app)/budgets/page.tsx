import Budgets from "@/front-end/components/budgets/budgets";
import { getAllBudgetsServerAction } from "@/back-end/server-actions/budget-actions";
import { getTransactionsMonthlyExpensesByCategoryServerAction } from "@/back-end/server-actions/transaction-actions";

export const dynamic = 'force-dynamic';

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
