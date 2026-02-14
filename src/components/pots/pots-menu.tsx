"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pot } from "@prisma/client";
import { AddPotDialog } from "./add-pot-dialog";
import { useState } from "react";

type PotAction = (pot: Pot) => void;

interface IPotMenuProps {
  pot: Pot;
  children: React.ReactNode;
  onAddMoney?: PotAction;
  onEdit?: PotAction;
  onDelete?: PotAction;
}

export function PotMenu({ pot, children, onEdit, onDelete }: IPotMenuProps) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-app-color">
          Actions with "{pot.name}"
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
          Edit Pot
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={() => onDelete?.(pot)}
        >
          Delete Pot
        </DropdownMenuItem>
      </DropdownMenuContent>
      <AddPotDialog
        pot={pot}
        isDialogOpen={isEditDialogOpen}
        setDialogOpen={setEditDialogOpen}
      />
    </DropdownMenu>
  );
}
