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
      <div className="font-bold text-3xl max-mobileM:text-xl">{name}</div>
      <div className="flex flex-row items-center gap-3">
        <LocaleSwitcher />
        {buttonName && (
          <button
            type="button"
            onClick={() => handleButtonClick?.()}
            className="bg-black rounded-lg text-white text-sm p-2 cursor-pointer"
          >
            {buttonName}
          </button>
        )}
      </div>
    </div>
  );
}
