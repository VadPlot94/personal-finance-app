"use client";

import { deletePotServerAction } from "@/back-end/server-actions/pot-actions";
import { toast } from "sonner";
import { DeleteDialog } from "@/front-end/components/dialogs/delete-dialog";
import { IDeletePotDialogProps } from "@/front-end/components/types";

export function DeletePotDialog({
  pot,
  isDialogOpen,
  setDialogOpen,
}: IDeletePotDialogProps) {
  const handlePotDelete = async (): Promise<void> => {
    const response = await deletePotServerAction(pot?.id);
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
      data={pot}
      isDialogOpen={isDialogOpen}
      setDialogOpen={setDialogOpen}
      handleDeleteClick={handlePotDelete}
    />
  );
}
