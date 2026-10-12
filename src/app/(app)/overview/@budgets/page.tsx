import budgetController from "@/back-end/controllers/budget-controller";
import transactionController from "@/back-end/controllers/transaction-controller";
import BudgetsTile from "@/front-end/components/budgets/budgets-tile";

export default async function BudgetsTilePage() {
  const budgetsResponse = await budgetController.getAllBudgets();
  const { data } =
    await transactionController.getTransactionsMonthlyExpensesByCategory();
  return (
    <BudgetsTile
      budgets={budgetsResponse?.data}
      transactionsByCategoryList={data}
    />
  );
}
