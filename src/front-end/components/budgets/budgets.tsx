"use client";

import type { Budget } from "@prisma/client";
import { createContext, useState } from "react";
import BudgetDonutChart from "@/front-end/components/budgets/budget-donut-chart";
import BudgetsItem from "@/front-end/components/budgets/budgets-item";
import { DeleteBudgetDialog } from "@/front-end/components/budgets/dialogs/delete-budget-dialog";
import { EditBudgetDialog } from "@/front-end/components/budgets/dialogs/edit-budget-dialog";
import type { IBudgetsProps } from "@/front-end/components/budgets/types";
import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";
import PageHeader from "@/front-end/components/page-header/page-header";
import { cn } from "@/lib/utils";

export const BudgetsContext = createContext<Budget[]>([]);

export default function Budgets({
  budgets = [],
  transactionsByCategoryList = [],
  isLoading = false,
}: IBudgetsProps) {
  const [isAddBudgetDialogOpen, setAddBudgetDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);
  return (
    <BudgetsContext value={budgets}>
      <PageHeader
        name="Budgets"
        buttonName="Add Budget"
        handleButtonClick={() => setAddBudgetDialogOpen(true)}
      />
      <EmptyContentWrapper
        hasItems={!!budgets?.length}
        isLoading={isLoading}
        emptyTitle="No budgets are available."
        emptyBody={
          <>
            Click <span className="font-semibold">'Add Budget'</span> button at
            the corner of the page to create your first budget.
          </>
        }
      >
        <div
          className={cn(
            "grid grid-cols-2 justify-between gap-5",
            "@max-containerQueryBreakpoint820/mainLayout:grid-cols-1",
          )}
        >
          <div
            className={cn(
              "sticky top-4 self-start",
              "@max-containerQueryBreakpoint820/mainLayout:static @max-containerQueryBreakpoint820/mainLayout:top-0",
            )}
          >
            <ItemCard>
              <BudgetDonutChart
                budgets={budgets}
                size={300}
                holeRatio={0.6}
                transactionsByCategoryList={transactionsByCategoryList}
              />
            </ItemCard>
          </div>
          <div className="flex flex-col justify-between gap-5">
            {budgets?.map((budget) => (
              <BudgetsItem
                key={budget.id}
                budget={budget}
                transactionsByCategoryList={transactionsByCategoryList}
                onEditBudget={setEditingBudget}
                onDeleteBudget={setDeletingBudget}
              />
            ))}
          </div>
        </div>
      </EmptyContentWrapper>
      {isAddBudgetDialogOpen && (
        <EditBudgetDialog
          isDialogOpen={isAddBudgetDialogOpen}
          setDialogOpen={setAddBudgetDialogOpen}
        />
      )}
      <EditBudgetDialog
        budget={editingBudget}
        isDialogOpen={!!editingBudget}
        setDialogOpen={(open: boolean) => {
          if (!open) {
            setEditingBudget(null);
          }
        }}
      />
      <DeleteBudgetDialog
        budget={deletingBudget}
        isDialogOpen={!!deletingBudget}
        setDialogOpen={(open: boolean) => {
          if (!open) {
            setDeletingBudget(null);
          }
        }}
      />
    </BudgetsContext>
  );
}
