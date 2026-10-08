"use client";

import { useMemo } from "react";
import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";
import { RecurringSummaryItem } from "@/front-end/components/recurring/dialogs/recurring-summary-item";
import type { IRecurringTileProps } from "@/front-end/components/recurring/types";
import TileHeader from "@/front-end/components/tile-header/tile-header";
import recurringService from "@/front-end/services/recurring.service";
import constants from "@/shared/services/constants.service";

export default function RecurringTile({
  recurringTransactions = [],
}: IRecurringTileProps) {
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
    <ItemCard className="h-full">
      <TileHeader
        title="Recurring Bills"
        href="/recurring"
        linkLabel="See details"
      />
      <EmptyContentWrapper
        hasItems={!!recurringTransactions?.length}
        emptyTitle="No recurring bills are available."
      >
        <div className="flex flex-col gap-3 justify-between flex-1 text-xs text-app-color font-semibold">
          <RecurringSummaryItem
            label="Paid Bills"
            amount={stats.paidAmount}
            wrapperClassName="px-2 items-center h-12 rounded-lg bg-app-background border-l-3 border-l-green-800"
          />

          <RecurringSummaryItem
            label="Total Upcoming"
            amount={stats.upcomingAmount}
            wrapperClassName="px-2 items-center h-12 rounded-lg bg-app-background border-l-3 border-l-yellow-400"
          />

          <RecurringSummaryItem
            label="Due Soon"
            amount={stats.dueSoonAmount}
            wrapperClassName="px-2 items-center h-12 rounded-lg bg-app-background border-l-3 border-l-blue-400"
          />
        </div>
      </EmptyContentWrapper>
    </ItemCard>
  );
}
