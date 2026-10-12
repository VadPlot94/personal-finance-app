import { getAllRecurringSRF } from "@/back-end/server-actions/recurring-actions";
import RecurringTile from "@/front-end/components/recurring/recurring-tile";

export default async function RecurringTilePage() {
  // TODO: Need to get recurring not by transactionsCount by time - for ex last 2 months
  const { data: { transactions } = {} } = await getAllRecurringSRF({
    transactionsCount: 500,
  });
  return <RecurringTile recurringTransactions={transactions} />;
}
