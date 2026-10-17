import BalanceCard from "@/back-end/components/balance-card/balance-card";
import type { IOverviewBalanceCardsProps } from "@/back-end/components/overview-balance-cards/types";
import { cn } from "@/lib/utils";

export default function OverviewBalanceCards({
  balance,
  t,
}: IOverviewBalanceCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-4",
        "@max-containerQueryBreakpoint820/mainLayout:grid-cols-1",
      )}
    >
      <BalanceCard
        title={t("i18n.PageOverview.CurrentBalance")}
        amount={balance?.current}
        bgColor="bg-black"
        textTitleColor="text-white"
        textAmountColor="text-white"
      />
      <BalanceCard
        title={t("i18n.PageOverview.Income")}
        amount={balance?.income}
      />
      <BalanceCard
        title={t("i18n.PageOverview.Expenses")}
        amount={balance?.expenses}
      />
    </div>
  );
}
