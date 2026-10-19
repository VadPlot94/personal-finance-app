"use client";

import { useTranslations } from "next-intl";
import type { IDeleteDialogProps } from "@/front-end/components/dialogs/types";
import { Button } from "@/front-end/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/front-end/components/ui/dialog";

export function DeleteDialog({
  data,
  isDialogOpen,
  setDialogOpen,
  handleDeleteClick,
}: IDeleteDialogProps) {
  const t = useTranslations();

  const handleDialogClose = (): void => {
    setDialogOpen(false);
  };

  const itemName = data?.name || t("i18n.Common.DeleteFallbackName");

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            {t("i18n.Common.DeleteTitle", { name: itemName })}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="text-app-color text-xs">
            {t("i18n.Common.DeleteBody", { name: itemName })}
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-between">
          <Button
            className="flex-1 w-full h-12 cursor-pointer"
            onClick={() => handleDialogClose()}
          >
            {t("i18n.Common.GoBack")}
          </Button>
          <Button
            className="flex-1 w-full bg-red-500 h-12 hover:bg-red-400 cursor-pointer"
            onClick={() => handleDeleteClick?.()}
          >
            {t("i18n.Common.Delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
