import "@/app/globals.css";
import { BalanceCard } from "@/front-end/components/balance-card/balance-card";
import { cn } from "@/lib/utils";
import { getBalanceServerAction } from "@/back-end/server-actions/balance-actions";
import { IOverviewLayoutProps } from "./types";

export default async function OverviewLayout({
  transactions,
  pots,
  recurring,
  budgets,
  notfound,
}: IOverviewLayoutProps) {
  const balanceResult = await getBalanceServerAction();
  const balance = balanceResult.data;

  return (
    <>
      <div className="h-15 flex items-center justify-start font-bold text-3xl">
        <span>Overview</span>
      </div>
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
        {notfound && (
          <div className="flex flex-col gap-4 col-span-2">{notfound}</div>
        )}
      </div>
    </>
  );
}
