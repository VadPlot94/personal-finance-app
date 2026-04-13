import constants from "@/shared/services/constants.service";
import { cn } from "@/lib/utils";
import ItemCard from "../item-card/item-card";
import { IBalanceCardProps } from "./types";

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
        }) ?? "--"}
      </div>
    </ItemCard>
  );
}
