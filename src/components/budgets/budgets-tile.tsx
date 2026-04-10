"use client";

import TileHeader from "../tile-header/tile-header";
import { IBudgetsTileProps } from "../types";
import BudgetDonutChart from "./budget-donut-chart";

export default function BudgetsTile({
  budgets = [],
  transactionsByCategoryList = [],
}: IBudgetsTileProps) {
  return (
    <div className="flex flex-col justify-between gap-5 rounded-lg p-5 bg-white shadow-sm hover:shadow-[0_0_10px_1px_rgba(0,0,0,0.3)]">
      <TileHeader title="Budgets" href="/budgets" linkLabel="View All" />
      <div className="flex flex-row justify-center items-center h-full gap-5">
        <BudgetDonutChart
          budgets={budgets}
          size={300}
          holeRatio={0.6}
          transactionsByCategoryList={transactionsByCategoryList}
        />
      </div>
    </div>
  );
}
