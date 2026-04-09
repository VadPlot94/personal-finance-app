"use client";

import Link from "next/link";
import EmptyContainer from "../empty-container/empty-container";
import TileContentHeader from "../tile-content-header/tile-content-header";
import { IRecurringTileProps } from "../types";
import { RecurringSummaryItem } from "./dialogs/recurring-summary-item";
import recurringService from "@/services/recurring.service";
import constants from "@/services/constants.service";
import { useMemo } from "react";

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
    <div className="flex flex-col justify-between gap-5 h-full rounded-lg p-5 shadow-sm bg-white">
      <TileContentHeader
        title="Recurring Bills"
        href="/recurring"
        linkLabel="See details"
      />
      <EmptyContainer
        hasItems={!!recurringTransactions?.length}
        emptyTitle="No recurring bills are available."
      >
        <div className="flex flex-col gap-3 justify-between text-xs text-app-color font-semibold">
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
      </EmptyContainer>
    </div>
  );
}
