"use client";

import { useState } from "react";
import { IPotsProps } from "../types";
import { AddPotDialog } from "./add-pot-dialog";
import PotItem from "./pots-item";

export default function Pots({ pots = [] }: IPotsProps) {
  const [isAddPotDialogOpen, setAddPotDialogOpen] = useState(false);

  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="font-bold text-3xl">Pots</div>
        <AddPotDialog
          isDialogOpen={isAddPotDialogOpen}
          setDialogOpen={setAddPotDialogOpen}
        >
          <button className="cursor-pointer bg-black rounded-lg text-white text-sm p-2">
            + Add New Pot
          </button>
        </AddPotDialog>
      </div>
      <div className="grid grid-cols-2 justify-between gap-5">
        {pots
          ?.filter((pot) => !!pot)
          ?.map((pot) => (
            <PotItem key={pot.id} pot={pot} />
          ))}
      </div>
    </>
  );
}
