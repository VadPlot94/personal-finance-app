"use client";

import { useTranslations } from "next-intl";
import BudgetDonutChart from "@/front-end/components/budgets/budget-donut-chart";
import type { IBudgetsTileProps } from "@/front-end/components/budgets/types";
import ItemCard from "@/front-end/components/item-card/item-card";
import TileHeader from "@/front-end/components/tile-header/tile-header";
import constants from "@/shared/services/constants.service";

export default function BudgetsTile({
  budgets = [],
  transactionsByCategoryList = [],
}: IBudgetsTileProps) {
  const t = useTranslations();

  return (
    <ItemCard>
      <TileHeader
        title={t("i18n.BudgetsPage.Title")}
        href={constants.AppRoutes.budgets}
        linkLabel={t("i18n.Common.ViewAll")}
      />
      <div className="flex flex-row justify-center items-center h-full gap-5">
        <BudgetDonutChart
          budgets={budgets}
          size={300}
          holeRatio={0.6}
          transactionsByCategoryList={transactionsByCategoryList}
        />
      </div>
    </ItemCard>
  );
}
