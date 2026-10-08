"use client";

import { toast } from "sonner";
import { deleteBudgetServerAction } from "@/back-end/server-actions/budget-actions";
import type { IDeleteBudgetDialogProps } from "@/front-end/components/budgets/types";
import { DeleteDialog } from "@/front-end/components/dialogs/delete-dialog";

export function DeleteBudgetDialog({
  budget,
  isDialogOpen,
  setDialogOpen,
}: IDeleteBudgetDialogProps) {
  const handleBudgetDelete = async (): Promise<void> => {
    const response = await deleteBudgetServerAction(budget?.id);
    if (response?.success) {
      toast.success("Success", {
        description: response.message || "OK",
      });
      setDialogOpen(false);
    } else {
      toast.error("Error", {
        description: response.error || "ERROR",
      });
    }
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
