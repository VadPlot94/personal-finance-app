"use client";

import { useState } from "react";
import { ITransactionsProps } from "../types";
import PageContentHeader from "../page-content-header/page-content-header";
import TransactionsTableLayout from "./transactions-table-layout";
import { CreateTransactionDialog } from "./dialogs/create-transaction-dialog";
import EmptyContainer from "../empty-container/empty-container";
import TransactionsTable from "./tables/transactions-table";

export default function Transactions({
  transactions = [],
  paginationData,
  category,
}: ITransactionsProps) {
  const [isCreateTransactionDialogOpen, setCreateTransactionDialogOpen] =
    useState(false);

  return (
    <>
      <PageContentHeader
        name="Transactions"
        buttonName="Create Transaction"
        handleButtonClick={() => setCreateTransactionDialogOpen(true)}
      />
      <EmptyContainer
        hasItems={!!transactions?.length}
        emptyTitle="No transactions are available."
        emptyBody={
          <>
            Click <span className="font-semibold">'Add Transaction'</span>{" "}
            button at the corner of the page to create it.
          </>
        }
      >
        <div className="flex flex-col gap-6 justify-between rounded-lg p-5 bg-white shadow-sm min-h-133.25">
          <TransactionsTableLayout
            transactions={transactions}
            paginationData={paginationData}
            category={category}
          >
            {(transactionsItems) => (
              <TransactionsTable transactions={transactionsItems} />
            )}
          </TransactionsTableLayout>
        </div>
      </EmptyContainer>
      {isCreateTransactionDialogOpen && (
        <CreateTransactionDialog
          isDialogOpen={isCreateTransactionDialogOpen}
          setDialogOpen={setCreateTransactionDialogOpen}
        />
      )}
    </>
  );
}
