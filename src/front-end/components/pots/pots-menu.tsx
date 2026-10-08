"use client";

import { useState } from "react";
import { DeletePotDialog } from "@/front-end/components/pots/dialogs/delete-pot-dialog";
import { EditPotDialog } from "@/front-end/components/pots/dialogs/edit-pot-dialog";
import type { IPotsMenuProps } from "@/front-end/components/pots/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/front-end/components/ui/dropdown-menu";

export function PotsMenu({ pot, children }: IPotsMenuProps) {
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
