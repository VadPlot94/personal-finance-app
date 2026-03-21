"use client";

import { useState } from "react";
import { ITransactionsProps } from "../types";
import PageContentHeader from "../page-content-header/page-content-header";
import TransactionsTableLayout from "./transactions-table-layout";

export default function Transactions({
  transactions = [],
  paginationData,
  category,
}: ITransactionsProps) {
  const [isAddTransactionDialogOpen, setAddTransactionDialogOpen] =
    useState(false);

  return (
    <>
      <PageContentHeader
        name="Transactions"
        buttonName="Add Transaction"
        handleButtonClick={() => setAddTransactionDialogOpen(true)}
      />
      {transactions?.length ? (
        <div className="@container flex flex-col gap-6 justify-between rounded-lg p-5 bg-white shadow-sm min-h-133.25">
          <TransactionsTableLayout
            transactions={transactions}
            paginationData={paginationData}
            category={category}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full h-full justify-center items-center text-app-color">
          <p className="font-semibold">No transactions are available.</p>
          <p>
            Click{" "}
            <span className="font-semibold">&nbsp;'Add Transaction'&nbsp;</span>{" "}
            button at the corner of the page to create it.
          </p>
        </div>
      )}
    </>
  );
}
