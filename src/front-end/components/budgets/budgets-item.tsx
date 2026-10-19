"use client";

import type { Budget } from "@prisma/client";
import { useTranslations } from "next-intl";
import { BudgetsMenu } from "@/front-end/components/budgets/budgets-menu";
import type { IBudgetsItemProps } from "@/front-end/components/budgets/types";
import ItemCard from "@/front-end/components/item-card/item-card";
import TransactionsTile from "@/front-end/components/transactions/transactions-tile";
import budgetService from "@/front-end/services/budget.service";
import transactionService from "@/front-end/services/transaction.service";
import type { TransactionUICategory } from "@/shared/services/constants.service";
import type { ITransactionsForCategoryData } from "@/shared/services/types";

function getBudgetCardViewModel(
  budget: Budget,
  transactionsByCategoryList: ITransactionsForCategoryData[] | undefined,
) {
  const currentCategoryTransactionsData = transactionsByCategoryList?.find(
    ({ category }) => category === budget?.category,
  );
  const { spent, remaining, percentBarProgress } =
    budgetService.getBudgetPercentageData(
      budget.maximum,
      currentCategoryTransactionsData?.transactions,
    );
  const isOver = remaining < 0;
  const isWarning = percentBarProgress >= 90 && percentBarProgress <= 100;
  const latestTransactions =
    currentCategoryTransactionsData?.transactions.slice(0, 3);

  return {
    spent,
    remaining,
    percentBarProgress,
    isOver,
    isWarning,
    latestTransactions,
  };
}

export default function BudgetsItem({
  budget,
  transactionsByCategoryList,
  onEditBudget,
  onDeleteBudget,
}: IBudgetsItemProps) {
  const t = useTranslations();
  const {
    spent,
    remaining,
    percentBarProgress,
    isOver,
    isWarning,
    latestTransactions,
  } = getBudgetCardViewModel(budget, transactionsByCategoryList);

  const categoryLabel = transactionService.getCategoryLabel(budget.category, t);

  return (
    <ItemCard>
      <div className="flex flex-col gap-3 justify-between">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-between items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: budget.theme || "grey" }}
            ></div>
            <div className="font-bold text-xl">{categoryLabel}</div>
          </div>
          <div className="cursor-pointer">
            <BudgetsMenu
              budget={budget}
              onEditBudget={onEditBudget}
              onDeleteBudget={onDeleteBudget}
            >
              <img
                className="w-5 h-5"
                src="assets/images/icon-ellipsis.svg"
                alt={t("i18n.Common.Actions")}
              />
            </BudgetsMenu>
          </div>
        </div>
        <div className="text-app-color">
          {t("i18n.BudgetsPage.MaximumOf", {
            amount: `$${budget.maximum.toFixed(2)}`,
          })}
        </div>
        <div
          className="p-1 w-full rounded-sm bg-app-background overflow-hidden h-9 border-2 border-transparent transition-all duration-300"
          style={{
            borderColor: isOver
              ? "#dc2626"
              : // red-600
                isWarning
                ? "#f59e0b"
                : // amber-500
                  "transparent",
          }}
        >
          <div
            className="rounded-sm h-full transition-[width] duration-500 ease-in-out bg-green-500 w-0"
            style={{
              backgroundColor: budget.theme,
              width: `${percentBarProgress}%`,
            }}
          ></div>
        </div>
        <div className="flex flex-row items-between justify-start gap-3">
          <div className="flex flex-row gap-4 items-center w-full">
            <div
              className="h-full min-w-1 w-1 rounded"
              style={{ backgroundColor: budget.theme || "grey" }}
            ></div>
            <div className="flex flex-col justify-between min-w-0 max-w-25 h-12 text-xs overflow-hidden">
              <div className="text-app-color truncate font-semibold">
                {t("i18n.BudgetsPage.Spent")}
              </div>
              <div className={`font-bold ${!budget && "text-app-color"}`}>
                ${spent || "0.0"}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center w-full">
            <div className="h-full min-w-1 w-1 rounded bg-app-background"></div>
            <div className="flex flex-col justify-between min-w-0 max-w-25 h-12 text-xs overflow-hidden">
              <div className="text-app-color truncate font-semibold">
                {t("i18n.BudgetsPage.Remaining")}
              </div>
              <div className={`font-bold ${!budget && "text-app-color"}`}>
                ${remaining || "0.0"}
              </div>
            </div>
          </div>
        </div>
        {isOver && (
          <div className="mt-1 text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded-md flex items-center gap-2">
            <span>⚠️</span>
            <span>
              {t("i18n.BudgetsPage.OverBudgetBy", {
                amount: `$${Math.abs(remaining).toFixed(2)}`,
              })}
            </span>
          </div>
        )}

        {isWarning && !isOver && (
          <div className="mt-1 text-sm font-medium text-amber-700 bg-amber-50 px-3 py-2 rounded-md flex items-center gap-2">
            <span>⚠️</span>
            <span>
              {t("i18n.BudgetsPage.AlmostUsed", {
                percent: percentBarProgress.toFixed(0),
              })}
            </span>
          </div>
        )}
        <div className="mt-1 mb-3">
          <TransactionsTile
            transactions={latestTransactions}
            isBudgetTile={true}
            category={budget?.category as TransactionUICategory}
          />
        </div>
      </div>
    </ItemCard>
  );
}
