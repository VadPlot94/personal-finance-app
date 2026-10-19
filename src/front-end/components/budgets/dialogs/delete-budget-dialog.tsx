"use client";

import { useTranslations } from "next-intl";
import { deleteBudgetSRF } from "@/back-end/server-actions/budget-actions";
import type { IDeleteBudgetDialogProps } from "@/front-end/components/budgets/types";
import { DeleteDialog } from "@/front-end/components/dialogs/delete-dialog";
import { handleDialogFormActionResult } from "@/lib/utils";

export function DeleteBudgetDialog({
  budget,
  isDialogOpen,
  setDialogOpen,
}: IDeleteBudgetDialogProps) {
  const t = useTranslations();

  const handleBudgetDelete = async (): Promise<void> => {
    const response = await deleteBudgetSRF(budget?.id);
    handleDialogFormActionResult(response, false, setDialogOpen, undefined, t);
  };

  return (
    <DeleteDialog
      data={{ id: budget?.id, name: budget?.category }}
      isDialogOpen={isDialogOpen}
      setDialogOpen={setDialogOpen}
      handleDeleteClick={handleBudgetDelete}
    />
  );
}
