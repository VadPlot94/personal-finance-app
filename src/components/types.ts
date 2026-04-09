import { ITransactionsForCategoryData } from "@/repositories/types";
import {
  Theme,
  TransactionType,
  TransactionUICategory,
} from "@/services/constants.service";
import { Budget, Pot, Transaction } from "@prisma/client";

export interface IBalanceCardProps {
  title: string;
  amount: number;
  bgColor?: string;
  textTitleColor?: string;
  textAmountColor?: string;
}

export interface IPageContentHeaderProps {
  name: string;
  buttonName?: string;
  handleButtonClick?: () => void;
}

export interface IDeleteDialogProps {
  data: { id: string; name: string };
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
  handleDeleteClick?: () => void;
}

export interface IDeletePotDialogProps {
  pot: Pot;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IDeleteBudgetDialogProps {
  budget: Budget;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IDeleteRecurringDialogProps {
  recurringTransaction: Transaction;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IEditBudgetDialogProps {
  children?: React.ReactNode;
  budget?: Budget;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IAddBudgetFormData {
  id: string;
  budgetCategory: string;
  maximum: string;
  theme: Theme;
}

export interface IPotsProps {
  pots: Pot[];
  availableBalance: number;
}

export interface IPotsTileProps {
  pots: Pot[];
}
export interface IPotItemProps {
  pot: Pot;
  availableBalance: number;
}

export interface IAddMoneyPotDialogProps {
  children?: React.ReactNode;
  pot: Pot;
  availableBalance: number;
  isWithdraw?: boolean;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IEditPotDialogProps {
  children?: React.ReactNode;
  pot?: Pot;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IAddPotFormData {
  id: string;
  potName: string;
  target: string;
  theme: Theme;
}

export interface IPotMenuProps {
  pot: Pot;
  children: React.ReactNode;
}

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
  amount: number;
  date: string;
}

export interface IBillsTableProps {
  transactions: Transaction[];
  referenceDate: Date | null | undefined;
}

export interface ITransactionsTableProps {
  transactions: Transaction[];
}

export interface IBudgetsProps {
  transactionsByCategoryList: ITransactionsForCategoryData[] | undefined;
  budgets: Budget[] | undefined;
}

export interface IBudgetsTileProps {
  transactionsByCategoryList: ITransactionsForCategoryData[] | undefined;
  budgets: Budget[] | undefined;
}

export interface IBudgetMenuProps {
  budget: Budget;
  children: React.ReactNode;
}

export interface IBudgetDonutChartProps {
  budgets: Budget[];
  size?: number; // px
  holeRatio?: number; // 0–1, ex: 0.55 = 55% hole in the middle of the chart
  className?: string;
  transactionsByCategoryList: ITransactionsForCategoryData[] | undefined;
}

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

export interface IEmptyContainerProps {
  hasItems: boolean;
  children: React.ReactNode;
  emptyTitle: React.ReactNode;
  emptyBody?: React.ReactNode;
}
