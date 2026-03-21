import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { balanceRepository } from "@/repositories/balance.repository";
import { ReactNode } from "react";

export default async function OverviewLayout({
  transactions,
  pots,
  recurring,
  budgets,
}: {
  [key: string]: ReactNode | undefined;
}) {
  const balance = await balanceRepository.getCurrent();

  // Content queries - connected with @container
  const containerQueryBreakpoint = "@max-[580px]";

  return (
    <>
      <div className="h-15 flex items-center justify-start font-bold text-3xl">
        <span>Overview</span>
      </div>
      <div
        className={cn(
          "grid grid-cols-3 gap-4",
          "max-md:grid-cols-1",
          `${containerQueryBreakpoint}:grid-cols-1`,
        )}
      >
        <div className="flex flex-col justify-center gap-3 h-26 rounded-lg pl-5 bg-black shadow-sm">
          <div className="text-white text-sm">Current Balance</div>
          <div className="text-white font-bold text-3xl">
            $
            {balance?.current?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3 h-26 rounded-lg pl-5 bg-white shadow-sm">
          <div className="text-app-color font-semibold text-sm">Income</div>
          <div className="font-bold text-3xl">
            $
            {balance?.income?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-3 h-26 rounded-lg pl-5 bg-white shadow-sm">
          <div className="text-app-color font-semibold text-sm">Expenses</div>
          <div className="font-bold text-3xl">
            $
            {balance?.expenses?.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "grid grid-cols-[repeat(2,minmax(355px,1fr))] gap-5",
          "max-lg:grid-cols-1",
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
      </div>
    </>
  );
}
