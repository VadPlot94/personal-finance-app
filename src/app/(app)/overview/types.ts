import type { ReactNode } from "react";
import type { IBalanceDTOOutput } from "@/back-end/dto-models/balance-dto.model";

export interface IOverviewLayoutProps {
  transactions: ReactNode;
  pots: ReactNode;
  recurring: ReactNode;
  budgets: ReactNode;
  children?: ReactNode;
  notfound?: ReactNode;
}

export interface IOverviewBalanceCardsProps {
  balance?: IBalanceDTOOutput;
}
