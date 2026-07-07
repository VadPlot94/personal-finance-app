"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/front-end/components/ui/dropdown-menu";
import { IBudgetsMenuProps } from "./types";

export function BudgetsMenu({
  budget,
  children,
  onEditBudget,
  onDeleteBudget,
}: IBudgetsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-app-color">
          Actions with "{budget.category}"
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onEditBudget?.(budget)}
          className="cursor-pointer"
        >
          Edit Budget
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={() => onDeleteBudget?.(budget)}
        >
          Delete Budget
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
