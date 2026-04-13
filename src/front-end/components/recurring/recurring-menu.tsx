"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/front-end/components/ui/dropdown-menu";
import { useState } from "react";
import { IRecurringMenuProps } from "./types";
import { DeleteRecurringDialog } from "./dialogs/delete-recurring-dialog";

export function RecurringMenu({
  recurringTransaction,
  children,
}: IRecurringMenuProps) {
  const [isDeleteRecurringDialogOpen, setDeleteRecurringDialogOpen] =
    useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-app-color">
          Actions with "{recurringTransaction.name}"
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={() => setDeleteRecurringDialogOpen(true)}
        >
          Delete Recurring Bill
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isDeleteRecurringDialogOpen && (
        <DeleteRecurringDialog
          recurringTransaction={recurringTransaction}
          isDialogOpen={isDeleteRecurringDialogOpen}
          setDialogOpen={setDeleteRecurringDialogOpen}
        />
      )}
    </DropdownMenu>
  );
}
