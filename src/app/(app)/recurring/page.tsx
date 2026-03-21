import Recurring from "@/components/recurring/recurring";
import { getTransactionsServerAction } from "@/server-actions/transaction-actions";

export default async function RecurringPage() {
  // TODO: Need to get recurring not by transactionsCount by by time - for ex last 2 months
  const { data: { paginationData, transactions } = {} } =
    await getTransactionsServerAction({
      isRecurring: true,
      transactionsCount: 500,
    });
  return (
    <Recurring
      recurringTransactions={transactions}
      paginationData={paginationData}
    />
  );
}
