"use client";

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
      ),
    [recurringTransactions, now /* realToday */],
  );

  const referenceDateLabel =
    recurringService.formatReferenceDateLabel(referenceDate);

  return (
    <>
      <PageHeader
        name="Recurring Bills"
        buttonName="Add Recurring Bill"
        handleButtonClick={() => setAddRecurringBillDialogOpen(true)}
      />
      <EmptyContentWrapper
        hasItems={!!recurringTransactions?.length}
        isLoading={isLoading}
        emptyTitle="No recurring bills are available."
        emptyBody={
          <>
            Click{" "}
            <span className="font-semibold">
              &nbsp;'Add Recurring Bill'&nbsp;
            </span>{" "}
            button at the corner of the page to create it.
          </>
        }
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
                  alt="Recurring bills icon"
                />
              </div>
              <div className="flex flex-col gap-3 text-white">
                <div className="text-sm">
                  Total Bills ({stats.referenceMonthName}, as of{" "}
                  {referenceDateLabel})
                </div>
                <div className="font-bold text-3xl">${stats.totalBills}</div>
              </div>
            </ItemCard>

            <ItemCard className="justify-start">
              <div className="font-bold">Summary</div>
              <div className="flex flex-col justify-between text-xs">
                <RecurringSummaryItem
                  label="Paid Bills"
                  count={stats.paidCount}
                  amount={stats.paidAmount}
                />

                <div className="my-3 h-px bg-gray-200 w-full" />

                <RecurringSummaryItem
                  label="Total Upcoming"
                  count={stats.upcomingCount}
                  amount={stats.upcomingAmount}
                />

                <div className="my-3 h-px bg-gray-200 w-full" />

                <RecurringSummaryItem
                  label="Due Soon"
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
