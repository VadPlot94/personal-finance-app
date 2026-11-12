import type { Transaction } from "@prisma/client";
import type { IPaginationData } from "@/front-end/components/transactions/types";

export interface IRecurringProps {
  recurringTransactions?: Transaction[];
  /**
   * All recurring expenses for the Paid / Upcoming / Due Soon summary.
   * `recurringTransactions` is only the current table page, so totals cannot
   * be computed from it — later pages would be missing from the counts.
   */
  statsTransactions?: Transaction[];
  paginationData?: IPaginationData;
  isLoading?: boolean;
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
  count?: number | string;
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
