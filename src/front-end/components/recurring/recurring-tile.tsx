"use client";

import { useEffect, useMemo, useState } from "react";
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
  // Avoid hydration mismatch: new Date() during render can differ SSR vs client.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const stats = useMemo(
    () =>
      recurringService.computeRecurringStats(
        recurringTransactions,
        now,
        constants.RecurringDueSoonDays,
      ).stats,
    [recurringTransactions, now /* realToday */],
  );

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
