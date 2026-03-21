import Transactions from "@/components/transactions/transactions";
import { getTransactionsServerAction } from "@/server-actions/transaction-actions";
import constants, { TransactionUICategory } from "@/services/constants.service";
import { notFound } from "next/navigation";

interface ITransactionsPageProps {
  searchParams: Promise<{ category: string }>;
}

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
    await getTransactionsServerAction({
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
