"use client";
import potService from "@/services/pot.service";
import { IPotItemProps } from "../types";
import { PotMenu } from "./pots-menu";
import { ChangeMoneyDialog } from "./dialogs/change-money-dialog";
import { useState } from "react";

export default function PotItem({ pot, availableBalance }: IPotItemProps) {
  const [isAddMoneyDialogOpen, setAddMoneyDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const targetPotProgress = potService.getStrPercentage(
    potService.calculateProgressPercentage(pot.total, pot.target),
  );

  return (
    <>
      <div className="flex flex-col justify-between gap-5 h-63 rounded-lg p-5 bg-white shadow-sm hover:shadow-[0_0_10px_1px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-8 justify-between">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-between items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: pot.theme || "grey" }}
              ></div>
              <div className="font-bold text-xl">{pot.name}</div>
            </div>
            <div className="cursor-pointer">
              <PotMenu pot={pot}>
                <img
                  className="w-5 h-5"
                  src="assets/images/icon-ellipsis.svg"
                  alt="Actions"
                />
              </PotMenu>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center gap-3">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="text-app-color text-xs font-semibold">
                Total Saved
              </div>
              <div className="font-bold text-2xl">
                $
                {pot.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="w-full rounded-sm bg-app-background overflow-hidden h-2">
              <div
                className="rounded-sm h-full transition-[width] duration-500 ease-in-out bg-green-500 w-0"
                style={{ backgroundColor: pot.theme, width: targetPotProgress }}
              ></div>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <div className="font-bold text-xs">{targetPotProgress}</div>
              <div className="text-app-color text-xs font-semibold">
                Target of ${pot.target.toLocaleString("en-US")}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center gap-3">
            <button
              onClick={() => setAddMoneyDialogOpen(true)}
              className="bg-app-background rounded-lg text-black text-sm p-2 w-full font-bold h-10 cursor-pointer border-2 border-transparent hover:shadow-[0_0_10px_1px_rgba(0,0,0,0.3)]"
            >
              + Add Money
            </button>
            <button
              onClick={() => setWithdrawDialogOpen(true)}
              className="bg-app-background rounded-lg text-black text-sm p-2 w-full font-bold cursor-pointer hover:shadow-[0_0_10px_1px_rgba(0,0,0,0.3)]"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>
      {isAddMoneyDialogOpen && (
        <ChangeMoneyDialog
          pot={pot}
          availableBalance={availableBalance}
          isDialogOpen={isAddMoneyDialogOpen}
          setDialogOpen={setAddMoneyDialogOpen}
        />
      )}
      {isWithdrawDialogOpen && (
        <ChangeMoneyDialog
          pot={pot}
          availableBalance={availableBalance}
          isWithdraw={true}
          isDialogOpen={isWithdrawDialogOpen}
          setDialogOpen={setWithdrawDialogOpen}
        />
      )}
    </>
  );
}
