"use client";

import type { IItemCardProps } from "@/front-end/components/item-card/types";
import { cn } from "@/lib/utils";

export default function ItemCard({ children, className = "" }: IItemCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-5 rounded-lg p-5 bg-white shadow-sm hover:shadow-[0_0_10px_1px_rgba(0,0,0,0.3)] min-w-60",
        className,
      )}
    >
      {children}
    </div>
  );
}
