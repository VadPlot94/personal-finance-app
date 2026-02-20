import Transactions from "@/components/transactions/transactions";
import { getTransactionsServerAction } from "@/server-actions/transaction-actions";

export default async function TransactionsPage() {
  const { data: { paginationData, transactions } = {} } =
    await getTransactionsServerAction();
  return (
    <Transactions transactions={transactions} paginationData={paginationData} />
  );
}
