"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import type { IErrorViewProps } from "@/front-end/components/error-view/types";
import logger from "@/shared/services/logger.service";

export default function ErrorView({
  error,
  retry,
  logArea = "[error]",
}: IErrorViewProps) {
  const t = useTranslations();

  useEffect(() => {
    logger.logError(
      `${logArea} Uncaught error${error.digest ? ` (${error.digest})` : ""}`,
      error,
    );
  }, [error, logArea]);

  return (
    <main
      className="flex min-h-full items-center justify-center p-5"
      role="alert"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          {t("i18n.Errors.Title")}
        </h1>
        <p className="text-sm text-app-color">{t("i18n.Errors.Body")}</p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground">
            {t("i18n.Errors.ErrorId")} {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => retry()}
          className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {t("i18n.Common.TryAgain")}
        </button>
      </div>
    </main>
  );
}
