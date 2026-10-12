import { notFound } from "next/navigation";
import type { ITransactionsPageProps } from "@/app/(app)/transactions/types";
import { getAllTransactionsSRF } from "@/back-end/server-actions/transaction-actions";
import Transactions from "@/front-end/components/transactions/transactions";
import constants, {
  TransactionUICategory,
} from "@/shared/services/constants.service";

export default async function TransactionsPage({
  searchParams,
}: ITransactionsPageProps) {
  const params = await searchParams;
  const category = (
    params?.category
      ? decodeURIComponent(params?.category)
      : TransactionUICategory.AllTransactions
  ) as TransactionUICategory;
  if (!Object.values(TransactionUICategory).includes(category)) {
    notFound();
  }
  const { data: { paginationData, transactions } = {} } =
    await getAllTransactionsSRF({
      transactionsCount: constants.TransactionRecordsPerPage,
    });
  return (
    <Transactions
      transactions={transactions}
      paginationData={paginationData}
      category={category}
    />
  );
}
