"use client";

import { createContext, useState } from "react";
import { IPotsProps } from "../types";
import { EditPotDialog } from "./dialogs/edit-pot-dialog";
import PotItem from "./pots-item";
import { Pot } from "@prisma/client";
import PageContentHeader from "../page-content-header/page-content-header";

export const PotsContext = createContext<Pot[]>([]);

export default function Pots({ pots = [], availableBalance }: IPotsProps) {
  const [isEditPotDialogOpen, setEditPotDialogOpen] = useState(false);

  return (
    <PotsContext value={pots}>
      <PageContentHeader
        name="Pots"
        buttonName="+ Add New Pot"
        handleButtonClick={() => setEditPotDialogOpen(true)}
      />
      {pots?.length ? (
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
      ) : (
        <div className="flex flex-col w-full h-full justify-center items-center text-app-color">
          <p className="font-semibold">No pots are available.</p>
          <p>
            Click{" "}
            <span className="font-semibold">&nbsp;'+Add New Pot'&nbsp;</span>{" "}
            button at the corner of the page to create your first pot.
          </p>
        </div>
      )}
      {isEditPotDialogOpen && (
        <EditPotDialog
          isDialogOpen={isEditPotDialogOpen}
          setDialogOpen={setEditPotDialogOpen}
        />
      )}
    </PotsContext>
  );
}
