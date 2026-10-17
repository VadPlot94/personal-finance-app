import type { IOverviewBalanceProps } from "@/back-end/components/overview-balance/types";
import OverviewBalanceCards from "@/back-end/components/overview-balance-cards/overview-balance-cards";
import balanceController from "@/back-end/controllers/balance-controller";

export default async function OverviewBalance({ t }: IOverviewBalanceProps) {
  const balanceResult = await balanceController.getBalance();
  return <OverviewBalanceCards balance={balanceResult.data} t={t} />;
}
