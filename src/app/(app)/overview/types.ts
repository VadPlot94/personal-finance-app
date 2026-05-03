import { ReactNode } from "react";

export interface IOverviewLayoutProps {
  transactions: ReactNode;
  pots: ReactNode;
  recurring: ReactNode;
  budgets: ReactNode;
  children?: ReactNode;
}