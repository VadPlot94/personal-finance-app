"use client";

import LocaleSwitcher from "@/front-end/components/locale-switcher/locale-switcher";
import type { IPageHeaderProps } from "@/front-end/components/page-header/types";

export default function PageHeader({
  name = "",
  buttonName,
  handleButtonClick,
}: IPageHeaderProps) {
  return (
    <div className="flex flex-row justify-between gap-3 items-center">
      <div className="min-w-0 truncate font-bold text-3xl max-mobileM:text-xl">
        {name}
      </div>
      <div className="flex shrink-0 flex-row items-center gap-3">
        <LocaleSwitcher />
        {buttonName && (
          <button
            type="button"
            onClick={() => handleButtonClick?.()}
            className="bg-black rounded-lg text-white text-sm p-2 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {buttonName}
          </button>
        )}
      </div>
    </div>
  );
}
