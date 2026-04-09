"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { IPotsProps } from "../types";
import { EditPotDialog } from "./dialogs/edit-pot-dialog";
import PotItem from "./pots-item";
import { Pot } from "@prisma/client";
import PageContentHeader from "../page-content-header/page-content-header";
import { cn } from "@/lib/utils";
import { wrapGrid } from "animate-css-grid";
import constants from "@/services/constants.service";
import EmptyContainer from "../empty-container/empty-container";

export const PotsContext = createContext<Pot[]>([]);

export default function Pots({ pots = [], availableBalance }: IPotsProps) {
  const [isEditPotDialogOpen, setEditPotDialogOpen] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef?.current;
    if (!grid) {
      return;
    }

    const gridAnimation = wrapGrid(grid, {
      duration: 200,
      easing: "easeInOut",
      stagger: 30,
    });

    // Find nearest @container
    const findNearestContainer = (element: HTMLElement): HTMLElement | null => {
      let current: HTMLElement | null = element;

      while (current) {
        const containerType =
          getComputedStyle(current).getPropertyValue("container-type");
        if (containerType && containerType !== "none") {
          return current;
        }
        current = current.parentElement;
      }
      return null; // fallback on grid
    };

    const containerElement = findNearestContainer(grid) || grid;

    let prevIsSmall =
      containerElement.offsetWidth < constants.ContainerQueryBreakpoint;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const isSmall = width < constants.ContainerQueryBreakpoint;

        if (isSmall !== prevIsSmall) {
          gridAnimation.forceGridAnimation();
          prevIsSmall = isSmall;
        }
      }
    });

    resizeObserver.observe(containerElement, { box: "content-box" });

    // Initial animation on mounting
    setTimeout(() => {
      gridAnimation.forceGridAnimation();
    }, 80);

    return () => {
      resizeObserver.disconnect();
    };
  }, [pots.length]);

  return (
    <PotsContext value={pots}>
      <PageContentHeader
        name="Pots"
        buttonName="+ Add New Pot"
        handleButtonClick={() => setEditPotDialogOpen(true)}
      />
      <EmptyContainer
        hasItems={!!pots?.length}
        emptyTitle="No pots are available."
        emptyBody={
          <>
            Click <span className="font-semibold">'+Add New Pot'</span> button
            at the corner of the page to create your first pot.
          </>
        }
      >
        <div
          ref={gridRef}
          className={cn(
            "grid grid-cols-2 justify-between gap-5",
            "@max-containerQueryBreakpoint820/mainLayout:grid-cols-1",
            "overflow-hidden", // for animation
            "*:overflow-hidden", // for animation
            "*:transition-all *:duration-300", // for animation
          )}
        >
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
      </EmptyContainer>
      {isEditPotDialogOpen && (
        <EditPotDialog
          isDialogOpen={isEditPotDialogOpen}
          setDialogOpen={setEditPotDialogOpen}
        />
      )}
    </PotsContext>
  );
}
