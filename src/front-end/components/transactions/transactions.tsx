"use client";

import { useState } from "react";
import { ITransactionsProps } from "../types";
import PageHeader from "../page-header/page-header";
import TransactionsTableLayout from "./transactions-table-layout";
import { CreateTransactionDialog } from "./dialogs/create-transaction-dialog";
import EmptyContentWrapper from "../empty-content-wrapper/empty-content-wrapper";
import ItemCard from "../item-card/item-card";
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
      <PageHeader
        name="Transactions"
        buttonName="Create Transaction"
        handleButtonClick={() => setCreateTransactionDialogOpen(true)}
      />
      <EmptyContentWrapper
        hasItems={!!transactions?.length}
        emptyTitle="No transactions are available."
        emptyBody={
          <>
            Click <span className="font-semibold">'Add Transaction'</span>{" "}
            button at the corner of the page to create it.
          </>
        }
      >
        <ItemCard className="min-h-133.25">
          <TransactionsTableLayout
            transactions={transactions}
            paginationData={paginationData}
            category={category}
          >
            {(transactionsItems) => (
              <TransactionsTable transactions={transactionsItems} />
            )}
          </TransactionsTableLayout>
        </ItemCard>
      </EmptyContentWrapper>
      {isCreateTransactionDialogOpen && (
        <CreateTransactionDialog
          isDialogOpen={isCreateTransactionDialogOpen}
          setDialogOpen={setCreateTransactionDialogOpen}
        />
      )}
    </>
  );
}
