"use client";

import BudgetDonutChart from "@/front-end/components/budgets/budget-donut-chart";
import type { IBudgetsTileProps } from "@/front-end/components/budgets/types";
import ItemCard from "@/front-end/components/item-card/item-card";
import TileHeader from "@/front-end/components/tile-header/tile-header";

export default function BudgetsTile({
  budgets = [],
  transactionsByCategoryList = [],
}: IBudgetsTileProps) {
  return (
    <ItemCard>
      <TileHeader title="Budgets" href="/budgets" linkLabel="View All" />
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
