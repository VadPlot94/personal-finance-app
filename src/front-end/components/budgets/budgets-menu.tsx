"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/front-end/components/ui/dropdown-menu";
import { useState } from "react";
import { IBudgetsMenuProps } from "./types";
import { DeleteBudgetDialog } from "./dialogs/delete-budget-dialog";
import { EditBudgetDialog } from "./dialogs/edit-budget-dialog";

export function BudgetsMenu({ budget, children }: IBudgetsMenuProps) {
  const [isEditBudgetDialogOpen, setEditBudgetDialogOpen] = useState(false);
  const [isDeleteBudgetDialogOpen, setDeleteBudgetDialogOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-app-color">
          Actions with "{budget.category}"
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setEditBudgetDialogOpen(true)}
          className="cursor-pointer"
        >
          Edit Budget
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={() => setDeleteBudgetDialogOpen(true)}
        >
          Delete Budget
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isEditBudgetDialogOpen && (
        <EditBudgetDialog
          budget={budget}
          isDialogOpen={isEditBudgetDialogOpen}
          setDialogOpen={setEditBudgetDialogOpen}
        />
      )}
      {isDeleteBudgetDialogOpen && (
        <DeleteBudgetDialog
          budget={budget}
          isDialogOpen={isDeleteBudgetDialogOpen}
          setDialogOpen={setDeleteBudgetDialogOpen}
        />
      )}
    </DropdownMenu>
  );
}
