"use client";

import { useMemo, useState } from "react";
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
}: IRecurringProps) {
  const [_isAddTransactionDialogOpen, setAddRecurringBillDialogOpen] =
    useState(false);
  const [referenceDate, setReferenceDate] = useState<Date | null>(null);

  const recurringTransactionsForTable = recurringTransactions?.slice(
    0,
    constants.TransactionRecordsPerPage,
  );

  const stats = useMemo(() => {
    if (!recurringTransactions?.length) {
      return {
        referenceMonthName: "—",
        totalBills: "0.00",
        paidCount: 0,
        paidAmount: "0.00",
        upcomingCount: 0,
        upcomingAmount: "0.00",
        dueSoonCount: 0,
        dueSoonAmount: "0.00",
      };
    }

    // Step 1: latest date
    const latestDate = recurringService.findLatestRecurringDate(
      recurringTransactions,
    );
    if (!latestDate) {
      return {
        referenceMonthName: "No recurring bills",
        totalBills: "0.00",
        paidCount: 0,
        paidAmount: "0.00",
        upcomingCount: 0,
        upcomingAmount: "0.00",
        dueSoonCount: 0,
        dueSoonAmount: "0.00",
      };
    }

    // Step 2: forecast month
    const {
      year,
      month,
      name: referenceMonthName,
    } = recurringService.getForecastMonthAndName(latestDate);

    // Step 3: referenceDate (carry over current day/time)
    const realToday = new Date(); // in production: current date
    // const realToday = new Date("2026-03-12"); // for tests

    const referenceDate = recurringService.createReferenceDate(
      realToday,
      year,
      month,
    );
    setReferenceDate(referenceDate);

    // Step 4: all recurring bills for the month
    const monthBills = recurringService.getRecurringBillsInMonth(
      recurringTransactions,
      year,
      month,
    );

    if (!monthBills.length) {
      return {
        referenceMonthName,
        totalBills: "0.00",
        paidCount: 0,
        paidAmount: "0.00",
        upcomingCount: 0,
        upcomingAmount: "0.00",
        dueSoonCount: 0,
        dueSoonAmount: "0.00",
      };
    }

    // Step 5: compute paid/upcoming/due soon — now via the service
    const billStats = recurringService.calculateStatsFromBills(
      monthBills,
      referenceDate,
      constants.RecurringDueSoonDays,
    );

    const totalBillsRaw = billStats.paidAmount + billStats.upcomingAmount;

    return {
      referenceMonthName,
      totalBills: Math.abs(totalBillsRaw).toFixed(2),
      paidCount: billStats.paidCount,
      paidAmount: Math.abs(billStats.paidAmount).toFixed(2),
      upcomingCount: billStats.upcomingCount,
      upcomingAmount: Math.abs(billStats.upcomingAmount).toFixed(2),
      dueSoonCount: billStats.dueSoonCount,
      dueSoonAmount: Math.abs(billStats.dueSoonAmount).toFixed(2),
    };
  }, [recurringTransactions]);

  return (
    <>
      <PageHeader
        name="Recurring Bills"
        buttonName="Add Recurring Bill"
        handleButtonClick={() => setAddRecurringBillDialogOpen(true)}
      />

      <EmptyContentWrapper
        hasItems={!!recurringTransactions?.length}
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
                  {referenceDate?.toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                  })}
                  )
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
              referenceDate={referenceDate}
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
