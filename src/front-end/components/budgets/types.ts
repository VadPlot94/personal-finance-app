import { ITransactionsForCategoryData } from "@/back-end/DAL/repositories/types";
import { Theme } from "@/shared/services/constants.service";
import { Budget } from "@prisma/client";

export interface IBudgetsProps {
  transactionsByCategoryList: ITransactionsForCategoryData[] | undefined;
  budgets: Budget[] | undefined;
}

export interface IBudgetsTileProps {
  transactionsByCategoryList: ITransactionsForCategoryData[] | undefined;
  budgets: Budget[] | undefined;
}

export interface IBudgetsMenuProps {
  budget: Budget;
  children: React.ReactNode;
  onEditBudget?: (budget: Budget) => void;
  onDeleteBudget?: (budget: Budget) => void;
}

export interface IBudgetDonutChartProps {
  budgets: Budget[];
  size?: number;
  holeRatio?: number;
  className?: string;
  transactionsByCategoryList: ITransactionsForCategoryData[] | undefined;
}

export interface IDeleteBudgetDialogProps {
  budget?: Budget | null;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IEditBudgetDialogProps {
  children?: React.ReactNode;
  budget?: Budget | null;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

export interface IAddBudgetFormData {
  id: string;
  budgetCategory: string;
  maximum: string;
  theme: Theme;
}
