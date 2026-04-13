"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/front-end/components/ui/dialog";
import { Button } from "@/front-end/components/ui/button";
import { IDeleteDialogProps } from "../types";

export function DeleteDialog({
  data,
  isDialogOpen,
  setDialogOpen,
  handleDeleteClick,
}: IDeleteDialogProps) {
  const handleDialogClose = (): void => {
    setDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            Delete '{data?.name}'?
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="text-app-color text-xs">
            {`Are you sure you want to delete ${data?.name || "this item"}? This action cannot be
            reversed, and all the data inside it will be removed forever.`}
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-between">
          <Button
            className="flex-1 w-full h-12 cursor-pointer"
            onClick={() => handleDialogClose()}
          >
            No, Go Back
          </Button>
          <Button
            className="flex-1 w-full bg-red-500 h-12 hover:bg-red-400 cursor-pointer"
            onClick={() => handleDeleteClick?.()}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
