"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import EmptyContentWrapper from "@/front-end/components/empty-content-wrapper/empty-content-wrapper";
import ItemCard from "@/front-end/components/item-card/item-card";
import type { ITileErrorViewProps } from "@/front-end/components/tile-error-view/types";
import logger from "@/shared/services/logger.service";

export default function TileErrorView({ error, retry }: ITileErrorViewProps) {
  const t = useTranslations();

  useEffect(() => {
    logger.logError(
      `[tile-error-view] Uncaught slot error${error.digest ? ` (${error.digest})` : ""}`,
      error,
    );
  }, [error]);

  return (
    <ItemCard>
      <EmptyContentWrapper
        hasItems={false}
        emptyTitle={t("i18n.Errors.TileTitle")}
        emptyBody={t("i18n.Errors.TileBody")}
      />
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {t("i18n.Common.TryAgain")}
        </button>
      </div>
    </ItemCard>
  );
}
