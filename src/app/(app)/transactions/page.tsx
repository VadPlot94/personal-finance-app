import { notFound } from "next/navigation";
import { Suspense } from "react";
import transactionController from "@/back-end/controllers/transaction-controller";
import Transactions from "@/front-end/components/transactions/transactions";
import transactionService from "@/front-end/services/transaction.service";
import constants from "@/shared/services/constants.service";

export default async function TransactionsPage({
  searchParams,
}: PageProps<typeof constants.AppRoutes.transactions>) {
  const { data: { paginationData, transactions } = {} } =
    await transactionController.getAllTransactions({
      transactionsCount: constants.TransactionRecordsPerPage,
    });

  return (
    <Suspense
      fallback={
        <Transactions
          transactions={transactions}
          paginationData={paginationData}
        />
      }
    >
      {(async () => {
        const params = await searchParams;
        const category = transactionService.getValidTransactionCategory(
          params?.category as string,
        );
        if (!category) {
          return notFound();
        }
        return (
          <Transactions
            category={category}
            transactions={transactions}
            paginationData={paginationData}
          />
        );
      })()}
    </Suspense>
  );
}
