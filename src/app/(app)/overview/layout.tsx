import "@/app/globals.css";
import { Suspense } from "react";
import type { IOverviewBalanceCardsProps } from "@/app/(app)/overview/types";
import balanceController from "@/back-end/controllers/balance-controller";
import { BalanceCard } from "@/front-end/components/balance-card/balance-card";
import TestAppErrorButton from "@/front-end/components/test/test-app-error-button/test-app-error-button";
import { cn } from "@/lib/utils";
import type constants from "@/shared/services/constants.service";

export default function OverviewLayout({
  transactions,
  pots,
  recurring,
  budgets,
  notfound,
  throwerror,
}: LayoutProps<typeof constants.AppRoutes.overview>) {
  return (
    <>
      <div className="h-15 flex items-center justify-between gap-4 font-bold text-3xl">
        <span>Overview</span>
        <TestAppErrorButton />
      </div>
      <Suspense fallback={<OverviewBalanceCards />}>
        <OverviewBalance />
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

async function OverviewBalance() {
  const balanceResult = await balanceController.getBalance();
  return <OverviewBalanceCards balance={balanceResult.data} />;
}

function OverviewBalanceCards({ balance }: IOverviewBalanceCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-4",
        "@max-containerQueryBreakpoint820/mainLayout:grid-cols-1",
      )}
    >
      <BalanceCard
        title="Current Balance"
        amount={balance?.current}
        bgColor="bg-black"
        textTitleColor="text-white"
        textAmountColor="text-white"
      />
      <BalanceCard title="Income" amount={balance?.income} />
      <BalanceCard title="Expenses" amount={balance?.expenses} />
    </div>
  );
}
