import "@/app/globals.css";
import SideBar from "@/components/sidebar/sidebar";
import { balanceRepository } from "@/repositories/balance.repository";

export default async function OverviewLayout({
  transactions,
  pots,
  recurring,
  budgets,
}) {
  const balance = await balanceRepository.getCurrent();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[120px_1fr] lg:gap-8">
      <div>
        <SideBar />
      </div>
      <div>
        <div className="h-26 flex items-center justify-start font-bold text-xl">
          <span>Overview</span>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="flex flex-col justify-center gap-3 h-26 rounded-lg p-2.5 bg-black">
            <div className="font-semibold text-sm text-foreground-2">Current Balance</div>
            <div className="font-bold text-xl text-foreground-2">${balance?.current?.toLocaleString('en-US')}</div>
          </div>
          <div className="flex flex-col justify-center gap-3 h-26 rounded-lg p-2.5 bg-white">
            <div className="font-semibold text-sm">Income</div>
            <div className="font-bold text-xl">${balance?.income?.toLocaleString('en-US')}</div>
          </div>
          <div className="flex flex-col justify-center gap-3 h-26 rounded-lg p-2.5 bg-white">
            <div className="font-semibold text-sm">Expenses</div>
            <div className="font-bold text-xl">${balance?.expenses?.toLocaleString('en-US')}</div>
          </div>
        </div>
        <div>
          {transactions}
          {pots}
          {recurring}
          {budgets}
        </div>
      </div>
    </div>
  );
}
