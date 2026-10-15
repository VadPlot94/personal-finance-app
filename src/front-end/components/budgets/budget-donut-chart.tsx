"use client";

import type { Budget } from "@prisma/client";
import { useEffect, useState } from "react";
import type { IBudgetDonutChartProps } from "@/front-end/components/budgets/types";
import constants from "@/shared/services/constants.service";
import type { ITransactionsForCategoryData } from "@/shared/services/types";

function buildSpentByCategory(
  budgets: Budget[],
  transactionsByCategoryList: ITransactionsForCategoryData[] | undefined,
): Record<string, number> {
  return Object.fromEntries(
    budgets.map((budget) => {
      const transactionsByCategory = transactionsByCategoryList?.find(
        ({ category }) => category === budget.category,
      );

      const spent = transactionsByCategory
        ? Math.abs(
            transactionsByCategory.transactions.reduce(
              (sum, { amount }) => sum + amount,
              0,
            ),
          )
        : 0;

      return [budget.category, spent];
    }),
  );
}

function buildCategoriesWithSpent(
  budgets: Budget[],
  spentByCategory: Record<string, number>,
) {
  return budgets
    .map((budget) => ({
      ...budget,
      spent: spentByCategory[budget.category] || 0,
    }))
    .filter((item) => item.spent > 0)
    .sort((a, b) => b.spent - a.spent);
}

function buildGradient(
  categoriesWithSpent: ReturnType<typeof buildCategoriesWithSpent>,
  totalSpent: number,
): string {
  let cumulativePercent = 0;
  const gradientStops = categoriesWithSpent.map((budget) => {
    const percent = totalSpent > 0 ? (budget.spent / totalSpent) * 100 : 0;
    const roundedPercent = Number(percent.toFixed(2));
    const startDeg = Math.round(
      Number(cumulativePercent.toFixed(2)) * constants.MathDegreePercent,
    );
    const endDeg = Math.round(
      (cumulativePercent + roundedPercent) * constants.MathDegreePercent,
    );
    cumulativePercent += roundedPercent;
    return `${budget.theme} ${startDeg}deg ${endDeg}deg`;
  });

  cumulativePercent = Math.round(cumulativePercent);

  // 6. Gray sector — if the remaining amount is really noticeable
  if (totalSpent > 0 && cumulativePercent < 99.99) {
    const startDeg = cumulativePercent * constants.MathDegreePercent;
    gradientStops.push(`#e5e7eb ${startDeg}deg 360deg`);
  }

  return `conic-gradient(${gradientStops.join(", ")})`;
}

export default function BudgetDonutChart({
  budgets,
  size = constants.DefaultDonutChartSize,
  holeRatio = 0.58,
  transactionsByCategoryList,
}: IBudgetDonutChartProps) {
  const [donutSize, setDonutSize] = useState(constants.DefaultDonutChartSize);

  const spentByCategory = buildSpentByCategory(
    budgets,
    transactionsByCategoryList,
  );

  const totalSpent = Object.values(spentByCategory).reduce(
    (sum, v) => sum + v,
    0,
  );
  const totalAllMaximums = budgets.reduce(
    (sum, { maximum }) => sum + maximum,
    0,
  );

  const categoriesWithSpent = buildCategoriesWithSpent(
    budgets,
    spentByCategory,
  );

  const gradient = buildGradient(categoriesWithSpent, totalSpent);

  useEffect(() => {
    const checkSize = () => {
      const isSmall = window.matchMedia(
        `(max-width: ${constants.XSmallMobileBreakpoint}px)`,
      ).matches;
      setDonutSize(isSmall ? constants.DefaultDonutChartSize : size);
    };

    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <div className="flex flex-col justify-between items-center gap-5">
      {/* Circle + center */}
      <div
        className="grid rounded-full overflow-hidden shadow-lg h-fit transition-all duration-500 ease-in-out"
        style={{
          width: donutSize,
          height: donutSize,
          placeItems: "center",
        }}
      >
        <div
          className="col-start-1 row-start-1 w-full h-full"
          style={{ background: gradient }}
        />

        {/* White circle + text inside*/}
        <div
          className="col-start-1 row-start-1 bg-app-background rounded-full shadow-inner flex flex-col items-center justify-center text-center"
          style={{
            width: `${holeRatio * 100}%`,
            height: `${holeRatio * 100}%`,
          }}
        >
          <div>
            <div className="text-3xl font-bold text-gray-800">
              ${totalSpent.toFixed(0)}
            </div>
            <div className="text-xs text-app-color">
              of ${totalAllMaximums.toFixed(0)} Limit
            </div>
          </div>
        </div>
      </div>

      {/* Legend under circle */}
      <div className="text-xs w-full">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {categoriesWithSpent.map((b) => {
            const percent =
              totalSpent > 0 ? ((b.spent / totalSpent) * 100).toFixed(0) : 0;
            return (
              <div key={b.category} className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: b.theme }}
                />
                <span className="font-semibold text-gray-800">
                  {b.category}
                </span>
                <span className="text-gray-500">
                  ${b.spent.toFixed(0)} ({percent}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
