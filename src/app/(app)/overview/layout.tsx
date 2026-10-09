import "@/app/globals.css";
import { Suspense } from "react";
import type { IOverviewLayoutProps } from "@/app/(app)/overview/types";
import type { IBalanceDTOOutput } from "@/back-end/dto-models/balance-dto.model";
import { getBalanceServerAction } from "@/back-end/server-actions/balance-actions";
import { BalanceCard } from "@/front-end/components/balance-card/balance-card";
import { cn } from "@/lib/utils";

export default function OverviewLayout({
  transactions,
  pots,
  recurring,
  budgets,
  notfound,
}: IOverviewLayoutProps) {
  return (
    <>
      <div className="h-15 flex items-center justify-start font-bold text-3xl">
        <span>Overview</span>
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
        <div className="flex flex-col gap-4">
          {pots}
          {transactions}
        </div>
        <div className="flex flex-col gap-4">
          {budgets}
          {recurring}
        </div>
        {/* Intentional @notfound demo parallel route (loader + not-found). Do not remove. */}
        {notfound && (
          <div className="flex flex-col gap-4 col-span-2">{notfound}</div>
        )}
      </div>
    </>
  );
}

async function OverviewBalance() {
  const balanceResult = await getBalanceServerAction();
  return <OverviewBalanceCards balance={balanceResult.data} />;
}

function OverviewBalanceCards({ balance }: { balance?: IBalanceDTOOutput }) {
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
