type RecurringSummaryItemProps = {
  label: string;
  count?: number | string;
  amount: string;
  labelClassName?: string;
  valueClassName?: string;
  wrapperClassName?: string;
};

export function RecurringSummaryItem({
  label,
  count,
  amount,
  labelClassName = "text-app-color font-semibold",
  valueClassName = "font-bold",
  wrapperClassName = "",
}: RecurringSummaryItemProps) {
  const value =
    count != null && count !== "" ? `${count} ($${amount})` : `$${amount}`;

  return (
    <div className={`flex flex-row gap-6 justify-between ${wrapperClassName}`}>
      <div className={labelClassName}>{label}</div>
      <div className={valueClassName}>{value}</div>
    </div>
  );
}
