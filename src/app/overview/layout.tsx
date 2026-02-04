export default function OverviewLayout({
  transactions,
  pots,
  recurring,
  budgets,
}) {
  return (
    <div>
      <span>Hello from Overview Layout!</span>
      <div>
        {transactions}
        {pots}
        {recurring}
        {budgets}
      </div>
    </div>
  );
}
