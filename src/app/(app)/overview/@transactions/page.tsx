import TransactionsTile from "@/front-end/components/transactions/transactions-tile";
import { getTransactionsServerAction } from "@/back-end/server-actions/transaction-actions";
import { TransactionUICategory } from "@/front-end/services/constants.service";

export default async function TransactionsTilePage() {
  const { data: { transactions } = {} } = await getTransactionsServerAction({
    transactionsCount: 5,
  });
  return (
    <TransactionsTile
      transactions={transactions}
      category={TransactionUICategory.AllTransactions}
    />
  );
}
