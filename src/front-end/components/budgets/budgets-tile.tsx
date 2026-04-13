"use client";

import ItemCard from "../item-card/item-card";
import TileHeader from "../tile-header/tile-header";
import { IBudgetsTileProps } from "../types";
import BudgetDonutChart from "./budget-donut-chart";

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
