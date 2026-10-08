import type { IBalanceCardProps } from "@/front-end/components/balance-card/types";
import ItemCard from "@/front-end/components/item-card/item-card";
import { cn } from "@/lib/utils";
import constants from "@/shared/services/constants.service";

export async function BalanceCard({
  title,
  amount,
  bgColor = "bg-white",
  textTitleColor = "text-app-color",
  textAmountColor = "",
}: IBalanceCardProps) {
  return (
    <ItemCard className={bgColor}>
      <div className={cn("text-sm font-semibold", textTitleColor)}>{title}</div>

      <div className={cn("font-bold text-3xl", textAmountColor)}>
        $
        {amount?.toLocaleString("en-US", {
          minimumFractionDigits: constants.NumberFractionDigits,
        }) ?? "00.00"}
      </div>
    </ItemCard>
  );
}
