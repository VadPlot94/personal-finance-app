"use client";

import { IPageHeaderProps } from "../types";

export default function PageHeader({
  name = "",
  buttonName,
  handleButtonClick,
}: IPageHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="font-bold text-3xl max-mobileM:text-xl">{name}</div>
      {buttonName && (
        <button
          onClick={() => handleButtonClick?.()}
          className="bg-black rounded-lg text-white text-sm p-2 cursor-pointer"
        >
          {buttonName}
        </button>
      )}
    </div>
  );
}
