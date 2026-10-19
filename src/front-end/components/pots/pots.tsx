"use client";

import type { Pot } from "@prisma/client";
import { wrapGrid } from "animate-css-grid";
import { useTranslations } from "next-intl";
import { createContext, useEffect, useRef, useState } from "react";
import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import PageHeader from "@/front-end/components/page-header/page-header";
import { EditPotDialog } from "@/front-end/components/pots/dialogs/edit-pot-dialog";
import PotsItem from "@/front-end/components/pots/pots-item";
import type { IPotsProps } from "@/front-end/components/pots/types";
import { cn } from "@/lib/utils";
import constants from "@/shared/services/constants.service";

export const PotsContext = createContext<Pot[]>([]);

// Find nearest @container
function findNearestContainer(element: HTMLElement): HTMLElement | null {
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
}

export default function Pots({
  pots = [],
  availableBalance = 0,
  isLoading = false,
}: IPotsProps) {
  const t = useTranslations();
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
      <PageHeader
        name={t("i18n.PotsPage.Title")}
        buttonName={t("i18n.PotsPage.AddNewPotButton")}
        handleButtonClick={() => setEditPotDialogOpen(true)}
      />
      <EmptyContentWrapper
        hasItems={!!pots.length}
        isLoading={isLoading}
        emptyTitle={t("i18n.PotsPage.EmptyTitle")}
        emptyBody={t.rich("i18n.PotsPage.EmptyBody", {
          bold: (chunks) => <span className="font-semibold">{chunks}</span>,
        })}
      >
        <div
          ref={gridRef}
          className={cn(
            "grid grid-cols-2 justify-between gap-5",
            "@max-containerQueryBreakpoint820/mainLayout:grid-cols-1",
            "*:overflow-hidden", // for animation
            "*:transition-all *:duration-300", // for animation
          )}
        >
          {pots
            .filter((pot) => !!pot)
            .map((pot) => (
              <PotsItem
                key={pot.id}
                pot={pot}
                availableBalance={availableBalance}
              />
            ))}
        </div>
      </EmptyContentWrapper>
      {isEditPotDialogOpen && (
        <EditPotDialog
          isDialogOpen={isEditPotDialogOpen}
          setDialogOpen={setEditPotDialogOpen}
        />
      )}
    </PotsContext>
  );
}
