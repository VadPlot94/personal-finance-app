"use client";

import { useLinkStatus } from "next/link";
import type { ILoadingIndicatorProps } from "./types";

export default function LoadingIndicator({
  children,
  fullScreen = false,
  className,
}: ILoadingIndicatorProps) {
  const { pending } = useLinkStatus();
  const isLoading = pending || !children;

  const spinner = (
    <img
      src="/assets/images/icon-link-spinner.svg"
      alt="Loading"
      className={fullScreen ? "h-10 w-10 animate-spin" : "h-4 w-4 animate-spin"}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white/80">
        <span
          className={`inline-flex items-center justify-center ${className ?? ""}`}
          aria-hidden="true"
        >
          {spinner}
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex h-4 w-4 items-center justify-center ${className ?? ""}`}
      aria-hidden="true"
    >
      {isLoading ? spinner : children ? children : null}
    </span>
  );
}
