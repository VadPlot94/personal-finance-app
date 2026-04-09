"use client";
import Link from "next/link";
import TileContentHeader from "../tile-content-header/tile-content-header";
import { IBudgetsTileProps } from "../types";
import BudgetDonutChart from "./budget-donut-chart";

export default function BudgetsTile({
  budgets = [],
  transactionsByCategoryList = [],
}: IBudgetsTileProps) {
  return (
    <div className="flex flex-col justify-between gap-5 h-fit rounded-lg p-5 bg-white shadow-sm">
      <TileContentHeader title="Budgets" href="/budgets" linkLabel="View All" />
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
