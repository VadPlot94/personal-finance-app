import transactionController from "@/back-end/controllers/transaction-controller";
import TransactionsTile from "@/front-end/components/transactions/transactions-tile";
import { TransactionUICategory } from "@/shared/services/constants.service";

export default async function TransactionsTilePage() {
  const { data: { transactions } = {} } =
    await transactionController.getAllTransactions({
      transactionsCount: 5,
    });
  return (
    <TransactionsTile
      transactions={transactions}
      category={TransactionUICategory.AllTransactions}
    />
  );
}
