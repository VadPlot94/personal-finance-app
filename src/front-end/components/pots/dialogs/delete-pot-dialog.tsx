"use client";

import { useTranslations } from "next-intl";
import { deletePotSRF } from "@/back-end/server-actions/pot-actions";
import { DeleteDialog } from "@/front-end/components/dialogs/delete-dialog";
import type { IDeletePotDialogProps } from "@/front-end/components/pots/types";
import { handleDialogFormActionResult } from "@/lib/utils";

export function DeletePotDialog({
  pot,
  isDialogOpen,
  setDialogOpen,
}: IDeletePotDialogProps) {
  const t = useTranslations();

  const handlePotDelete = async (): Promise<void> => {
    const response = await deletePotSRF(pot?.id);
    handleDialogFormActionResult(response, false, setDialogOpen, undefined, t);
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
