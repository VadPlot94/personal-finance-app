"use client";

import { IPageContentHeaderProps } from "../types";

export default function PageContentHeader({
  name = "",
  buttonName,
  handleButtonClick,
}: IPageContentHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="font-bold text-3xl max-mobileM:text-xl">{name}</div>
      {buttonName && (
        <button
          onClick={() => handleButtonClick?.()}
          className="cursor-pointer bg-black rounded-lg text-white text-sm p-2"
        >
          {buttonName}
        </button>
      )}
    </div>
  );
}
