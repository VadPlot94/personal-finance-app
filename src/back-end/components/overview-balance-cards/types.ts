import type { getTranslations } from "next-intl/server";

export type OverviewTranslator = Awaited<ReturnType<typeof getTranslations>>;

export interface IOverviewBalanceCardsProps {
  balance?: {
    id: string;
    current: number;
    income: number;
    expenses: number;
  };
  t: OverviewTranslator;
}
