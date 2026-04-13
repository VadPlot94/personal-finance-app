import { Transaction } from "@prisma/client";
import { TransactionType, TransactionUICategory } from "@/shared/services/constants.service";

export interface IPaginationData {
  page: number;
  transactionsCount: number;
  allTransactionsCount: number;
}

export interface ITransactionsTileProps {
  transactions: Transaction[] | undefined;
  isBudgetTile?: boolean;
  category: TransactionUICategory;
}

export interface ITransactionsProps {
  transactions: Transaction[] | undefined;
  paginationData: IPaginationData | undefined;
  category?: TransactionUICategory;
}

export interface ITransactionsTableLayoutProps extends ITransactionsProps {
  isRecurringOnly?: boolean;
  referenceDate?: Date | null;
  children: (transactionsItems: Transaction[]) => React.ReactNode;
}

export interface ICreateTransactionDialogProps {
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export type TransactionCategory = Exclude<
  TransactionUICategory,
  TransactionUICategory.AllTransactions
>;

export interface ICreateTransactionFormData {
  transactionType: TransactionType;
  recipientOrSender: string;
  category: TransactionCategory;
  amount: string;
  date?: string;
}

export interface IBillsTableProps {
  transactions: Transaction[];
  referenceDate: Date | null | undefined;
}

export interface ITransactionsTableProps {
  transactions: Transaction[];
}
