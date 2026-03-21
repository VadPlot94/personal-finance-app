"use client";
import Link from "next/link";
import { IBudgetsTileProps } from "../types";
import BudgetDonutChart from "./budget-donut-chart";

export default function BudgetsTile({
  budgets = [],
  transactionsByCategoryList = [],
}: IBudgetsTileProps) {
  return (
    <div className="flex flex-col justify-between gap-5 h-fit rounded-lg p-5 bg-white shadow-sm">
      <div className="flex flex-row justify-between items-center">
        <div className="font-bold text-[20px]">Budgets</div>
        <Link
          href="/budgets"
          className="flex flex-row gap-1 text-app-color text-sm"
        >
          <span className="font-weight w-15">View All</span>
          <img src="assets/images/icon-caret-right.svg" />
        </Link>
      </div>
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
