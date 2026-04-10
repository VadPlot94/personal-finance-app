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
        "flex flex-col justify-between gap-5 rounded-lg p-5 bg-white shadow-sm hover:shadow-[0_0_10px_1px_rgba(0,0,0,0.3)]",
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
