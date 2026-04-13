"use client";

import { deleteRecurringServerAction } from "@/back-end/server-actions/transaction-actions";
import { toast } from "sonner";
import { DeleteDialog } from "@/front-end/components/dialogs/delete-dialog";
import { IDeleteRecurringDialogProps } from "@/front-end/components/types";

export function DeleteRecurringDialog({
  recurringTransaction,
  isDialogOpen,
  setDialogOpen,
}: IDeleteRecurringDialogProps) {
  const handleRecurringDelete = async (): Promise<void> => {
    const response = await deleteRecurringServerAction(
      recurringTransaction?.id,
    );
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
      data={recurringTransaction}
      isDialogOpen={isDialogOpen}
      setDialogOpen={setDialogOpen}
      handleDeleteClick={handleRecurringDelete}
    />
  );
}
