import type { ReactNode } from "react";

export interface IOverviewLayoutProps {
  transactions: ReactNode;
  pots: ReactNode;
  recurring: ReactNode;
  budgets: ReactNode;
  children?: ReactNode;
  notfound?: ReactNode;
  throwerror?: ReactNode;
}

export interface IOverviewBalanceCardsProps {
  balance?: {
    id: string;
    current: number;
    income: number;
    expenses: number;
  };
}
