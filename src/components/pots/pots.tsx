"use client";

import { IPotsProps } from "../types";
import { AddPotDialog } from "./add-pot-dialog";
import PotItem from "./pots-item";

export default function Pots({ pots = [] }: IPotsProps) {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="font-bold text-3xl">Pots</div>
        <AddPotDialog>
          <button className="cursor-pointer bg-black rounded-lg text-white text-sm p-2">
            + Add New Pot
          </button>
        </AddPotDialog>
      </div>
      <div className="grid grid-cols-2 justify-between gap-5">
        {pots
          ?.filter((pot) => !!pot)
          ?.map((pot, index) => (
            <PotItem key={pot.name + pot.total || index} pot={pot} />
          ))}
      </div>
    </>
  );
}
