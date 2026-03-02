"use client";

import { toast } from "sonner";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { IDeleteBudgetDialogProps } from "@/components/types";
import { deleteBudgetServerAction } from "@/server-actions/budget-actions";

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
    } else {
      toast.error("Error", {
        description: response.error || "ERROR",
      });
    }
  };

  return (
    <DeleteDialog
      data={{ id: budget.id, name: budget.category }}
      isDialogOpen={isDialogOpen}
      setDialogOpen={setDialogOpen}
      handleDeleteClick={handleBudgetDelete}
    />
  );
}
