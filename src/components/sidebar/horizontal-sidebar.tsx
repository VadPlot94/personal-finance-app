"use client";

import constants from "@/services/constants.service";
import { usePathname } from "next/navigation";

export default function HorizontalSideBar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-end bg-black rounded-tl-lg rounded-tr-lg shadow-sm min-w-full">
      <div className="text-app-color h-full pt-2 px-3">
        <nav className="flex flex-row gap-1">
          {constants.SideBarMenuItemsConfig.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-row justify-center items-center
                  p-3 rounded-tl-md rounded-tr-md transition cursor-pointer w-full
                  ${
                    pathname === item.href
                      ? "bg-white text-black border-b-4 border-b-green-500"
                      : "hover:bg-gray-800"
                  }
                `}
            >
              <img
                src={item.icon}
                alt={item.title}
                title={item.title}
                className="h-5 w-5"
              />
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
