import recurringController from "@/back-end/controllers/recurring-controller";
import Recurring from "@/front-end/components/recurring/recurring";

export default async function RecurringPage() {
  const [statsResult, tableResult] = await Promise.all([
    recurringController.getRecurringExpenses(),
    recurringController.getAllRecurring(),
  ]);

  return (
    <Recurring
      statsTransactions={statsResult.data ?? []}
      recurringTransactions={tableResult.data?.transactions}
      paginationData={tableResult.data?.paginationData}
    />
  );
}
