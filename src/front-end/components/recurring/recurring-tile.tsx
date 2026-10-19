"use client";

import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations();
  const locale = useLocale();
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
        locale,
      ).stats,
    [recurringTransactions, now /* realToday */, locale],
  );

  return (
    <ItemCard className="h-full">
      <TileHeader
        title={t("i18n.RecurringPage.Title")}
        href={constants.AppRoutes.recurring}
        linkLabel={t("i18n.Common.SeeDetails")}
      />
      <EmptyContentWrapper
        hasItems={!!recurringTransactions?.length}
        emptyTitle={t("i18n.RecurringPage.EmptyTitle")}
      >
        <div className="flex flex-col gap-3 justify-between flex-1 text-xs text-app-color font-semibold">
          <RecurringSummaryItem
            label={t("i18n.RecurringPage.PaidBills")}
            amount={stats.paidAmount}
            wrapperClassName="px-2 items-center h-12 rounded-lg bg-app-background border-l-3 border-l-green-800"
          />

          <RecurringSummaryItem
            label={t("i18n.RecurringPage.TotalUpcoming")}
            amount={stats.upcomingAmount}
            wrapperClassName="px-2 items-center h-12 rounded-lg bg-app-background border-l-3 border-l-yellow-400"
          />

          <RecurringSummaryItem
            label={t("i18n.RecurringPage.DueSoon")}
            amount={stats.dueSoonAmount}
            wrapperClassName="px-2 items-center h-12 rounded-lg bg-app-background border-l-3 border-l-blue-400"
          />
        </div>
      </EmptyContentWrapper>
    </ItemCard>
  );
}
