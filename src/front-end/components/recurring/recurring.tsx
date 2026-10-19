"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";
import PageHeader from "@/front-end/components/page-header/page-header";
import { RecurringSummaryItem } from "@/front-end/components/recurring/recurring-summary-item";
import type { IRecurringProps } from "@/front-end/components/recurring/types";
import BillsTable from "@/front-end/components/transactions/tables/bills-table";
import TransactionsTableLayout from "@/front-end/components/transactions/transactions-table-layout";
import recurringService from "@/front-end/services/recurring.service";
import { cn } from "@/lib/utils";
import constants from "@/shared/services/constants.service";

export default function Recurring({
  recurringTransactions = [],
  paginationData,
  isLoading = false,
}: IRecurringProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [_isAddTransactionDialogOpen, setAddRecurringBillDialogOpen] =
    useState(false);
  // Avoid hydration mismatch: new Date() / toLocaleString can differ SSR vs client.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const recurringTransactionsForTable = recurringTransactions?.slice(
    0,
    constants.TransactionRecordsPerPage,
  );

  const { stats, referenceDate } = useMemo(
    () =>
      recurringService.computeRecurringStats(
        recurringTransactions,
        now,
        constants.RecurringDueSoonDays,
        locale,
      ),
    [recurringTransactions, now /* realToday */, locale],
  );

  const referenceDateLabel = recurringService.formatReferenceDateLabel(
    referenceDate,
    locale,
  );

  const referenceMonthName =
    stats.referenceMonthName || t("i18n.RecurringPage.NoRecurringBills");

  return (
    <>
      <PageHeader
        name={t("i18n.RecurringPage.Title")}
        buttonName={t("i18n.RecurringPage.AddRecurringBill")}
        handleButtonClick={() => setAddRecurringBillDialogOpen(true)}
      />
      <EmptyContentWrapper
        hasItems={!!recurringTransactions?.length}
        isLoading={isLoading}
        emptyTitle={t("i18n.RecurringPage.EmptyTitle")}
        emptyBody={t.rich("i18n.RecurringPage.EmptyBody", {
          bold: (chunks) => <span className="font-semibold">{chunks}</span>,
        })}
      >
        <div
          className={cn(
            "grid grid-cols-[minmax(288px,1fr)_2fr] justify-between gap-6",
            "@max-containerQueryBreakpoint820/mainLayout:grid-cols-1",
          )}
        >
          <div className="flex flex-col gap-6">
            <ItemCard className="bg-black max-md:flex-row max-md:items-center">
              <div>
                <img
                  className="w-10"
                  src="assets/images/icon-recurring-bills.svg"
                  alt={t("i18n.RecurringPage.IconAlt")}
                />
              </div>
              <div className="flex flex-col gap-3 text-white">
                <div className="text-sm">
                  {t("i18n.RecurringPage.TotalBills", {
                    month: referenceMonthName,
                    date: referenceDateLabel,
                  })}
                </div>
                <div className="font-bold text-3xl">${stats.totalBills}</div>
              </div>
            </ItemCard>

            <ItemCard className="justify-start">
              <div className="font-bold">{t("i18n.RecurringPage.Summary")}</div>
              <div className="flex flex-col justify-between text-xs">
                <RecurringSummaryItem
                  label={t("i18n.RecurringPage.PaidBills")}
                  count={stats.paidCount}
                  amount={stats.paidAmount}
                />

                <div className="my-3 h-px bg-gray-200 w-full" />

                <RecurringSummaryItem
                  label={t("i18n.RecurringPage.TotalUpcoming")}
                  count={stats.upcomingCount}
                  amount={stats.upcomingAmount}
                />

                <div className="my-3 h-px bg-gray-200 w-full" />

                <RecurringSummaryItem
                  label={t("i18n.RecurringPage.DueSoon")}
                  count={stats.dueSoonCount}
                  amount={stats.dueSoonAmount}
                  labelClassName="text-red-500 font-semibold"
                  valueClassName="text-red-500 font-bold"
                />
              </div>
            </ItemCard>
          </div>

          <ItemCard>
            <TransactionsTableLayout
              transactions={recurringTransactionsForTable}
              paginationData={paginationData}
              isRecurringOnly={true}
            >
              {(transactionsItems) => (
                <BillsTable
                  transactions={transactionsItems}
                  referenceDate={referenceDate}
                />
              )}
            </TransactionsTableLayout>
          </ItemCard>
        </div>
      </EmptyContentWrapper>
    </>
  );
}
