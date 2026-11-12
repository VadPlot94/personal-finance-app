import recurringController from "@/back-end/controllers/recurring-controller";
import RecurringTile from "@/front-end/components/recurring/recurring-tile";

export default async function RecurringTilePage() {
  const { data: transactions } =
    await recurringController.getRecurringExpenses();
  return <RecurringTile recurringTransactions={transactions} />;
}
