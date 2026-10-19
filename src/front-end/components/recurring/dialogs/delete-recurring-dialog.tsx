"use client";

import { useTranslations } from "next-intl";
import { deleteRecurringSRF } from "@/back-end/server-actions/recurring-actions";
import { DeleteDialog } from "@/front-end/components/dialogs/delete-dialog";
import type { IDeleteRecurringDialogProps } from "@/front-end/components/recurring/types";
import { handleDialogFormActionResult } from "@/lib/utils";

export function DeleteRecurringDialog({
  recurringTransaction,
  isDialogOpen,
  setDialogOpen,
}: IDeleteRecurringDialogProps) {
  const t = useTranslations();

  const handleRecurringDelete = async (): Promise<void> => {
    const response = await deleteRecurringSRF(recurringTransaction?.id);
    handleDialogFormActionResult(response, false, setDialogOpen, undefined, t);
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
