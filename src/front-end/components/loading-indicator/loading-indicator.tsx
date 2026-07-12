"use client";

import { useLinkStatus } from "next/link";
import type { ILoadingIndicatorProps } from "./types";

export default function LoadingIndicator({ children }: ILoadingIndicatorProps) {
  const { pending } = useLinkStatus();

  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center"
      aria-hidden="true"
    >
      {pending ? (
        <img
          src="/assets/images/icon-link-spinner.svg"
          alt="Loading"
          className="h-4 w-4 animate-spin"
        />
      ) : children ? (
        children
      ) : null}
    </span>
  );
}
