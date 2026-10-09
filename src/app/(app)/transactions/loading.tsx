import Transactions from "@/front-end/components/transactions/transactions";
import { TransactionUICategory } from "@/shared/services/constants.service";

export default function Loading() {
  return (
    <Transactions
      transactions={undefined}
      paginationData={undefined}
      category={TransactionUICategory.AllTransactions}
    />
  );
}
