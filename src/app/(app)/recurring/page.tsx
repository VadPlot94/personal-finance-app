import { getAllRecurringSRF } from "@/back-end/server-actions/recurring-actions";
import Recurring from "@/front-end/components/recurring/recurring";

export default async function RecurringPage() {
  // TODO: Need to get recurring not by transactionsCount by by time - for ex last 2 months
  const { data: { paginationData, transactions } = {} } =
    await getAllRecurringSRF({
      transactionsCount: 500,
    });
  return (
    <Recurring
      recurringTransactions={transactions}
      paginationData={paginationData}
    />
  );
}
