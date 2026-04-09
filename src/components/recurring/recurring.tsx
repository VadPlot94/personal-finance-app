"use client";

import { useState, useMemo } from "react";
import PageContentHeader from "../page-content-header/page-content-header";
import TransactionsTableLayout from "../transactions/transactions-table-layout";
import { IRecurringProps } from "../types";
import recurringService from "@/services/recurring.service";
import constants from "@/services/constants.service";
import { cn } from "@/lib/utils";
import BillsTable from "../transactions/tables/bills-table";
import { RecurringSummaryItem } from "./recurring-summary-item";

export default function Recurring({
  recurringTransactions = [],
  paginationData,
}: IRecurringProps) {
  const [isAddTransactionDialogOpen, setAddRecurringBillDialogOpen] =
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

    // Шаг 1: самая поздняя дата
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

    // Шаг 2: месяц прогноза
    const {
      year,
      month,
      name: referenceMonthName,
    } = recurringService.getForecastMonthAndName(latestDate);

    // Шаг 3: referenceDate (перенос текущего дня/времени)
    const realToday = new Date(); // ← в продакшене текущая дата
    // const realToday = new Date("2026-03-12"); // для тестов

    const referenceDate = recurringService.createReferenceDate(
      realToday,
      year,
      month,
    );
    setReferenceDate(referenceDate);

    // Шаг 4: все recurring bills за месяц
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

    // Шаг 5: расчёт paid/upcoming/due soon — теперь через сервис
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
      <PageContentHeader
        name="Recurring Bills"
        buttonName="Add Recurring Bill"
        handleButtonClick={() => setAddRecurringBillDialogOpen(true)}
      />

      {recurringTransactions?.length ? (
        <div
          className={cn(
            "grid grid-cols-[minmax(288px,1fr)_2fr] justify-between gap-6",
            "@max-containerQueryBreakpoint820/mainLayout:grid-cols-1",
          )}
        >
          <div className="flex flex-col gap-6">
            <div
              className={cn(
                "flex flex-col gap-6 justify-start rounded-lg p-5 bg-black shadow-sm",
                "max-md:flex-row max-md:items-center",
              )}
            >
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
            </div>

            <div className="flex flex-col gap-5 justify-start rounded-lg p-5 bg-white shadow-sm">
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
            </div>
          </div>

          <div className="flex flex-col gap-6 justify-between rounded-lg p-5 bg-white shadow-sm">
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
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full justify-center items-center text-app-color">
          <p className="font-semibold">No recurring bills are available.</p>
          <p>
            Click{" "}
            <span className="font-semibold">
              &nbsp;'Add Recurring Bill'&nbsp;
            </span>{" "}
            button at the corner of the page to create it.
          </p>
        </div>
      )}
    </>
  );
}
