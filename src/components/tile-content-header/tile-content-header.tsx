"use client";

import Link from "next/link";
import { ITileContentHeaderProps } from "../types";
import { cn } from "@/lib/utils";

export default function TileContentHeader({
  title,
  href,
  linkLabel,
}: ITileContentHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="font-bold mobileXS:text-[20px] max-mobileXS:text-base">
        {title}
      </div>
      <Link href={href} className="flex flex-row gap-3 text-app-color text-sm">
        <span className="font-weight w-fit">{linkLabel}</span>
        <img src="assets/images/icon-caret-right.svg" />
      </Link>
    </div>
  );
}
