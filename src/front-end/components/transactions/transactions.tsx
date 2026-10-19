"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";
import PageHeader from "@/front-end/components/page-header/page-header";
import { CreateTransactionDialog } from "@/front-end/components/transactions/dialogs/create-transaction-dialog";
import TransactionsTable from "@/front-end/components/transactions/tables/transactions-table";
import TransactionsTableLayout from "@/front-end/components/transactions/transactions-table-layout";
import type { ITransactionsProps } from "@/front-end/components/transactions/types";

export default function Transactions({
  transactions = [],
  paginationData,
  category,
  isLoading = false,
}: ITransactionsProps) {
  const t = useTranslations();
  const [isCreateTransactionDialogOpen, setCreateTransactionDialogOpen] =
    useState(false);

  return (
    <>
      <PageHeader
        name={t("i18n.TransactionsPage.Title")}
        buttonName={t("i18n.TransactionsPage.CreateTransaction")}
        handleButtonClick={() => setCreateTransactionDialogOpen(true)}
      />
      <EmptyContentWrapper
        hasItems={!!transactions?.length}
        isLoading={isLoading}
        emptyTitle={t("i18n.TransactionsPage.EmptyTitle")}
        emptyBody={t.rich("i18n.TransactionsPage.EmptyBody", {
          bold: (chunks) => <span className="font-semibold">{chunks}</span>,
        })}
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
