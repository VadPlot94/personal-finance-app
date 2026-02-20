"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditPotDialog } from "./dialogs/edit-pot-dialog";
import { useState } from "react";
import { DeletePotDialog } from "./dialogs/delete-pot-dialog";
import { IPotMenuProps } from "../types";

export function PotMenu({ pot, children }: IPotMenuProps) {
  const [isEditPotDialogOpen, setEditPotDialogOpen] = useState(false);
  const [isDeletePotDialogOpen, setDeletePotDialogOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-app-color">
          Actions with "{pot.name}"
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setEditPotDialogOpen(true)}>
          Edit Pot
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={() => setDeletePotDialogOpen(true)}
        >
          Delete Pot
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isEditPotDialogOpen && (
        <EditPotDialog
          pot={pot}
          isDialogOpen={isEditPotDialogOpen}
          setDialogOpen={setEditPotDialogOpen}
        />
      )}
      {isDeletePotDialogOpen && (
        <DeletePotDialog
          pot={pot}
          isDialogOpen={isDeletePotDialogOpen}
          setDialogOpen={setDeletePotDialogOpen}
        />
      )}
    </DropdownMenu>
  );
}
