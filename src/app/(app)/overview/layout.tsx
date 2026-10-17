import "@/app/globals.css";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import OverviewBalance from "@/back-end/components/overview-balance/overview-balance";
import OverviewBalanceCards from "@/back-end/components/overview-balance-cards/overview-balance-cards";
import TestAppErrorButton from "@/front-end/components/test/test-app-error-button/test-app-error-button";
import { cn } from "@/lib/utils";
import type constants from "@/shared/services/constants.service";

export default async function OverviewLayout({
  transactions,
  pots,
  recurring,
  budgets,
  notfound,
  throwerror,
}: LayoutProps<typeof constants.AppRoutes.overview>) {
  const t = await getTranslations();

  return (
    <>
      <div className="h-15 flex items-center justify-between gap-4 font-bold text-3xl">
        <span>{t("i18n.PageOverview.Title")}</span>
        <TestAppErrorButton />
      </div>
      <Suspense fallback={<OverviewBalanceCards t={t} />}>
        <OverviewBalance t={t} />
      </Suspense>
      <div
        className={cn(
          "grid grid-cols-[repeat(2,minmax(355px,1fr))] gap-5",
          "@max-containerQueryBreakpoint820/mainLayout:grid-cols-1",
        )}
      >
        <div className="flex flex-col gap-4 @max-containerQueryBreakpoint820/mainLayout:col-span-2">
          {pots}
          {transactions}
        </div>
        <div className="flex flex-col gap-4 @max-containerQueryBreakpoint820/mainLayout:col-span-2">
          {budgets}
          {recurring}
        </div>
        {/* Intentional @notfound demo parallel route (loader + not-found). Do not remove. */}
        {notfound && (
          <div className="flex flex-col gap-4 col-span-2">{notfound}</div>
        )}
        {/* Intentional @throwerror demo parallel route (loader + page throws + error.tsx). Do not remove. */}
        {throwerror && (
          <div className="flex flex-col gap-4 col-span-2">{throwerror}</div>
        )}
      </div>
    </>
  );
}
