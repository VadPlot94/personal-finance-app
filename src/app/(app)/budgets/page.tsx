import Budgets from "@/components/budgets/budgets";
import { getAllBudgetsServerAction } from "@/server-actions/budget-actions";

export default async function BudgetsPage() {
  const budgetsResponse = await getAllBudgetsServerAction();
  return <Budgets budgets={budgetsResponse?.data} />;
}
