import "@/app/globals.css";
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

  return (
    <>
      <div className="h-15 flex items-center justify-start font-bold text-3xl">
        <span>Overview</span>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-4">
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
      <div className="grid grid-cols-2">
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
