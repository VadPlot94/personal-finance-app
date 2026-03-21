"use client";

import { TransactionUICategory } from "@/services/constants.service";
import TransactionsTile from "../transactions/transactions-tile";
import { IBudgetsProps } from "../types";
import BudgetDonutChart from "./budget-donut-chart";
import budgetService from "@/services/budget.service";
import { BudgetMenu } from "./budgets-menu";
import PageContentHeader from "../page-content-header/page-content-header";
import { createContext, useState } from "react";
import { Budget } from "@prisma/client";
import { EditBudgetDialog } from "./dialogs/edit-budget-dialog";
import { cn } from "@/lib/utils";

export const BudgetsContext = createContext<Budget[]>([]);

export default function Budgets({
  budgets = [],
  transactionsByCategoryList = [],
}: IBudgetsProps) {
  const [isAddBudgetDialogOpen, setAddBudgetDialogOpen] = useState(false);
  return (
    <BudgetsContext value={budgets}>
      <PageContentHeader
        name="Budgets"
        buttonName="Add Budget"
        handleButtonClick={() => setAddBudgetDialogOpen(true)}
      />
      {budgets?.length ? (
        <div
          className={cn(
            "grid grid-cols-2 justify-between gap-5",
            "max-lg:grid-cols-1",
          )}
        >
          <div
            className={cn(
              "sticky top-4 self-start",
              "max-lg:static max-lg:top-0",
            )}
          >
            <div className="rounded-lg p-5 bg-white min-w-100 h-fit shadow-sm hover:shadow-[0_0_10px_1px_rgba(0,0,0,0.3)]">
              <BudgetDonutChart
                budgets={budgets}
                size={300}
                holeRatio={0.6}
                transactionsByCategoryList={transactionsByCategoryList}
              />
            </div>
          </div>
          <div className="flex flex-col justify-between gap-5">
            {budgets.map((budget) => {
              const currentCategoryTransactionsData =
                transactionsByCategoryList?.find(
                  ({ category }) => category === budget?.category,
                );
              const { spent, remaining, percentBarProgress } =
                budgetService.getBudgetPercentageData(
                  budget.maximum,
                  currentCategoryTransactionsData?.transactions,
                );
              const isOver = remaining < 0;
              const isWarning =
                percentBarProgress >= 90 && percentBarProgress <= 100;
              return (
                <div
                  key={budget.id}
                  className="flex flex-col gap-6 justify-between rounded-lg p-5 bg-white shadow-sm min-w-100 hover:shadow-[0_0_10px_1px_rgba(0,0,0,0.3)]"
                >
                  <div className="flex flex-col gap-3 justify-between">
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row justify-between items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: budget.theme || "grey" }}
                        ></div>
                        <div className="font-bold text-xl">
                          {budget.category}
                        </div>
                      </div>
                      <div className="cursor-pointer">
                        <BudgetMenu budget={budget}>
                          <img
                            className="w-5 h-5"
                            src="assets/images/icon-ellipsis.svg"
                            alt="Actions"
                          />
                        </BudgetMenu>
                      </div>
                    </div>
                    <div className="text-app-color">
                      Maximum of ${budget.maximum.toFixed(2)}
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
                            Spent
                          </div>
                          <div
                            className={`font-bold ${!budget && "text-app-color"}`}
                          >
                            ${spent || "0.0"}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-center w-full">
                        <div className="h-full min-w-1 w-1 rounded bg-app-background"></div>
                        <div className="flex flex-col justify-between min-w-0 max-w-25 h-12 text-xs overflow-hidden">
                          <div className="text-app-color truncate font-semibold">
                            Remaining
                          </div>
                          <div
                            className={`font-bold ${!budget && "text-app-color"}`}
                          >
                            ${remaining || "0.0"}
                          </div>
                        </div>
                      </div>
                    </div>
                    {isOver && (
                      <div className="mt-1 text-sm font-medium text-red-600 bg-red-50 px-3 py-2 rounded-md flex items-center gap-2">
                        <span>⚠️</span>
                        <span>
                          Over budget by ${Math.abs(remaining).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {isWarning && !isOver && (
                      <div className="mt-1 text-sm font-medium text-amber-700 bg-amber-50 px-3 py-2 rounded-md flex items-center gap-2">
                        <span>⚠️</span>
                        <span>
                          Budget almost used ({percentBarProgress.toFixed(0)}%)
                        </span>
                      </div>
                    )}
                    <div className="mt-1 mb-3">
                      <TransactionsTile
                        transactions={currentCategoryTransactionsData?.transactions.slice(
                          0,
                          3,
                        )}
                        isBudgetTile={true}
                        category={budget?.category as TransactionUICategory}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full h-full justify-center items-center text-app-color">
          <p className="font-semibold">No budgets are available.</p>
          <p>
            Click{" "}
            <span className="font-semibold">&nbsp;'Add Budget'&nbsp;</span>{" "}
            button at the corner of the page to create your first budget.
          </p>
        </div>
      )}
      {isAddBudgetDialogOpen && (
        <EditBudgetDialog
          isDialogOpen={isAddBudgetDialogOpen}
          setDialogOpen={setAddBudgetDialogOpen}
        />
      )}
    </BudgetsContext>
  );
}
