import TransactionsTile from "@/components/transactions/transactions-tile";
import { getTransactionsServerAction } from "@/server-actions/transaction-actions";
import { TransactionUICategory } from "@/services/constants.service";

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
