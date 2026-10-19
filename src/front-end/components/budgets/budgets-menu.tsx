"use client";

import { useTranslations } from "next-intl";
import type { IBudgetsMenuProps } from "@/front-end/components/budgets/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/front-end/components/ui/dropdown-menu";
import transactionService from "@/front-end/services/transaction.service";

export function BudgetsMenu({
  budget,
  children,
  onEditBudget,
  onDeleteBudget,
}: IBudgetsMenuProps) {
  const t = useTranslations();
  const categoryLabel = transactionService.getCategoryLabel(budget.category, t);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-app-color">
          {t("i18n.Common.ActionsWith", { name: categoryLabel })}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onEditBudget?.(budget)}
          className="cursor-pointer"
        >
          {t("i18n.BudgetsPage.EditBudget")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={() => onDeleteBudget?.(budget)}
        >
          {t("i18n.BudgetsPage.DeleteBudget")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
