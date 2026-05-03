"use client";

import { IRecurringSummaryItemProps } from "./types";

export function RecurringSummaryItem({
  label,
  count,
  amount,
  labelClassName = "text-app-color font-semibold",
  valueClassName = "font-bold",
  wrapperClassName = "",
}: IRecurringSummaryItemProps) {
  return (
    <div className={`flex flex-row gap-6 justify-between ${wrapperClassName}`}>
      <div className={labelClassName}>{label}</div>
      <div className={valueClassName}>
        {count} (${amount})
      </div>
    </div>
  );
}
