"use client";
import Link from "next/link";
import { IPotsProps } from "../types";

export default function PotsTile({ pots = [] }: IPotsProps) {
  const totalSum =
    pots.reduce((acc, val) => acc + val.total, 0).toLocaleString("en-US") || 0;
  const filteredPots = [...pots].sort((a, b) => b.total - a.total).slice(0, 4);
  const tilePots = Array.from({ length: 4 }, (_, i) => filteredPots[i] || null);

  return (
    <div className="flex flex-col justify-between gap-5 h-46 rounded-lg p-5 bg-white shadow-sm">
      <div className="flex flex-row justify-between items-center">
        <div className="font-bold text-[20px]">Pots</div>
        <Link
          href="/pots"
          className="flex flex-row gap-1 text-app-color text-sm"
        >
          <span className="font-weight w-20">See details</span>
          <img src="/images/icon-caret-right.svg" />
        </Link>
      </div>
      <div className="flex flex-row justify-between h-full gap-5">
        <div className="flex flex-row justify-start items-center w-full gap-3 rounded-lg pl-5 bg-app-background shadow-sm">
          <div className="">
            <img src="/images/icon-pot.svg" />
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
              <div key={key} className="flex flex-row gap-4">
                <div
                  className="h-full min-w-1 w-1 rounded"
                  style={{ backgroundColor: pot?.theme || "grey" }}
                ></div>
                <div className="flex flex-col justify-between h-10 text-xs">
                  <div className="text-app-color w-25">{pot?.name || "--"}</div>
                  <div className={`font-bold ${!pot && "text-app-color"}`}>
                    ${pot?.total || "0.0"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
