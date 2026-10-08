"use client";

import Link from "next/link";
import LoadingIndicator from "@/front-end/components/loading-indicator/loading-indicator";
import type { ITileHeaderProps } from "@/front-end/components/tile-header/types";

export default function TileHeader({
  title,
  href,
  linkLabel,
}: ITileHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="font-bold mobileXS:text-[20px] max-mobileXS:text-base">
        {title}
      </div>
      <Link
        href={href}
        className="flex flex-row items-center gap-3 text-sm text-app-color"
      >
        <span className="w-fit font-weight">{linkLabel}</span>
        <LoadingIndicator>
          <img
            src="assets/images/icon-caret-right.svg"
            alt="Caret right"
            className="h-4 w-4"
          />
        </LoadingIndicator>
      </Link>
    </div>
  );
}
