"use client";
import ItemCard from "../item-card/item-card";
import TileHeader from "../tile-header/tile-header";
import { IPotsTileProps } from "../types";
import potService from "@/front-end/services/pot.service";
import { cn } from "@/lib/utils";

export default function PotsTile({ pots = [] }: IPotsTileProps) {
  const totalSum = potService
    .getAllSavedPotsMoney(pots)
    .toLocaleString("en-US");
  const filteredPots = [...pots].sort((a, b) => b.total - a.total).slice(0, 4);
  const tilePots = Array.from({ length: 4 }, (_, i) => filteredPots[i] || null);

  return (
    <ItemCard>
      <TileHeader title="Pots" href="/pots" linkLabel="See details" />
      <div
        className={cn(
          "flex flex-row justify-between h-full gap-5",
          "max-sm:flex-col",
        )}
      >
        <div className="flex flex-row justify-start items-center w-full gap-3 rounded-lg pl-5 bg-app-background shadow-sm min-h-25">
          <div>
            <img src="assets/images/icon-pot.svg" />
          </div>
          <div className="flex flex-col justify-between items-stretch">
            <div className="text-app-color text-sm">Total Saved</div>
            <div className="font-bold text-3xl">${totalSum}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 w-full gap-4">
          {tilePots.map((pot, index) => {
            const key = pot ? pot.name + pot.total : index;
            return (
              <div key={key} className="flex flex-row gap-4 items-center">
                <div
                  className="h-full min-w-1 w-1 rounded"
                  style={{ backgroundColor: pot?.theme || "grey" }}
                ></div>
                <div className="flex flex-col justify-between min-w-0 max-w-25 h-10 text-xs overflow-hidden">
                  <div className="text-app-color truncate">
                    {pot?.name || "--"}
                  </div>
                  <div className={`font-bold ${!pot && "text-app-color"}`}>
                    ${pot?.total || "0.0"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ItemCard>
  );
}
