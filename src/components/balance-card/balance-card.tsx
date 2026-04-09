import constants from "@/services/constants.service";
import { cn } from "@/lib/utils";
import { IBalanceCardProps } from "../types";

export async function BalanceCard({
  title,
  amount,
  bgColor = "bg-white",
  textTitleColor = "text-app-color",
  textAmountColor = "",
}: IBalanceCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center gap-3 h-26 rounded-lg pl-5 shadow-sm",
        bgColor,
      )}
    >
      <div className={cn("text-sm font-semibold", textTitleColor)}>{title}</div>

      <div className={cn("font-bold text-3xl", textAmountColor)}>
        $
        {amount?.toLocaleString("en-US", {
          minimumFractionDigits: constants.NumberFractionDigits,
        }) ?? "--"}
      </div>
    </div>
  );
}
