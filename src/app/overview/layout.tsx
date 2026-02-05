import { balanceRepository } from "@/repositories/balance.repository";

export default async function OverviewLayout({
  transactions,
  pots,
  recurring,
  budgets,
}) {
  const balance = await balanceRepository.getCurrent();

  return (
    <div>
      <span>Hello from Overview Layout!</span>
      <div>Current: {balance?.current}</div>
      <div>Income: {balance?.income}</div>
      <div>Expenses: {balance?.expenses}</div>
      <div>
        {transactions}
        {pots}
        {recurring}
        {budgets}
      </div>
    </div>
  );
}
