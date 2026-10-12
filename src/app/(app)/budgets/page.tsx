import budgetController from "@/back-end/controllers/budget-controller";
import transactionController from "@/back-end/controllers/transaction-controller";
import Budgets from "@/front-end/components/budgets/budgets";

export default async function BudgetsPage() {
  const budgetsResponse = await budgetController.getAllBudgets();
  const { data } =
    await transactionController.getTransactionsMonthlyExpensesByCategory();

  return (
    <Budgets
      budgets={budgetsResponse?.data}
      transactionsByCategoryList={data}
    />
  );
}
