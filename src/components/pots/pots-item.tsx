"use client";
import { IPotItemProps } from "../types";
import { PotMenu } from "./pots-menu";

export default function PotItem({ pot }: IPotItemProps) {
  const calculateProgressPercentage = (
    current: number,
    target: number,
  ): string => {
    if (!target) {
      return "100.00%";
    }
    const percentage = (current / target) * 100;
    return Math.max(0, Math.min(100, percentage)).toFixed(2) + "%";
  };

  const progress = calculateProgressPercentage(pot.total, pot.target);

  const handlePotMenuClick = () => {
    console.log("clicked");
  };

  const handleEdit = () => {
    console.log("edit");
  };

  const handleDelete = () => {
    console.log("delete");
  };

  return (
    <div className="flex flex-col justify-between gap-5 h-63 rounded-lg p-5 bg-white shadow-sm">
      <div className="flex flex-col gap-8 justify-between">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row justify-between items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: pot.theme || "grey" }}
            ></div>
            <div className="font-bold text-xl">{pot.name}</div>
          </div>
          <div className="cursor-pointer p-1 hover:bg-gray-100 rounded">
            <PotMenu pot={pot} onEdit={handleEdit} onDelete={handleDelete}>
              <img
                className="w-5 h-5"
                src="/images/icon-ellipsis.svg"
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
              style={{ backgroundColor: pot.theme, width: progress }}
            ></div>
          </div>
          <div className="flex flex-row justify-between items-center w-full">
            <div className="font-bold text-xs">{progress}</div>
            <div className="text-app-color text-xs font-semibold">
              Target of ${pot.target.toLocaleString("en-US")}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center gap-3">
          <button className="bg-app-background rounded-lg text-black text-sm p-2 w-full font-bold h-10">
            + Add Money
          </button>
          <button className="bg-app-background rounded-lg text-black text-sm p-2 w-full font-bold">
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
