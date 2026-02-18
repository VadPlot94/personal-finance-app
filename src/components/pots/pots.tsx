"use client";

import { createContext, useState } from "react";
import { IPotsProps } from "../types";
import { EditPotDialog } from "./dialogs/edit-pot-dialog";
import PotItem from "./pots-item";
import { Pot } from "@prisma/client";

export const PotsContext = createContext<Pot[]>([]);

export default function Pots({ pots = [], availableBalance }: IPotsProps) {
  const [isEditPotDialogOpen, setEditPotDialogOpen] = useState(false);

  return (
    <PotsContext value={pots}>
      <div className="flex flex-row justify-between">
        <div className="font-bold text-3xl">Pots</div>
        <EditPotDialog
          isDialogOpen={isEditPotDialogOpen}
          setDialogOpen={setEditPotDialogOpen}
        >
          <button className="cursor-pointer bg-black rounded-lg text-white text-sm p-2">
            + Add New Pot
          </button>
        </EditPotDialog>
      </div>
      <div className="grid grid-cols-2 justify-between gap-5">
        {pots
          ?.filter((pot) => !!pot)
          ?.map((pot) => (
            <PotItem
              key={pot.id}
              pot={pot}
              availableBalance={availableBalance}
            />
          ))}
      </div>
    </PotsContext>
  );
}
