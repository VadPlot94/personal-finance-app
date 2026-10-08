import type { Transaction } from "@prisma/client";
import type { IPaginationData } from "@/front-end/components/transactions/types";

export interface IRecurringProps {
  recurringTransactions: Transaction[] | undefined;
  paginationData: IPaginationData | undefined;
}

export interface IRecurringTileProps {
  recurringTransactions: Transaction[] | undefined;
}

export interface IRecurringMenuProps {
  recurringTransaction: Transaction;
  children: React.ReactNode;
}

export interface IRecurringSummaryItemProps {
  label: string;
  count: number | string;
  amount: string;
  labelClassName?: string;
  valueClassName?: string;
  wrapperClassName?: string;
}

export interface IDeleteRecurringDialogProps {
  recurringTransaction: Transaction;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}
