"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deletePotServerAction } from "@/server-actions/pot-actions";
import { Pot } from "@prisma/client";
import { toast } from "sonner";

interface IDeletePotDialogProps {
  pot: Pot;
  isDialogOpen: boolean;
  setDialogOpen: (isDialogOpen: boolean) => void;
}

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

  const handlePotDialogClose = (): void => {
    setDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-120">
        <DialogHeader>
          <DialogTitle className="font-bold text-3xl">
            Delete '{pot?.name}'?
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="text-app-color text-xs">
            Are you sure you want to delete this pot? This action cannot be
            reversed, and all the data inside it will be removed forever.
          </div>
        </div>
        <div className="flex flex-row gap-2 justify-between">
          <Button
            className="flex-1 w-full h-12"
            onClick={() => handlePotDialogClose()}
          >
            No, Go Back
          </Button>
          <Button
            className="flex-1 w-full bg-red-500 h-12 hover:bg-red-400"
            onClick={() => handlePotDelete()}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
