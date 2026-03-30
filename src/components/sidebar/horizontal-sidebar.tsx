"use client";

import { cn } from "@/lib/utils";
import constants from "@/services/constants.service";
import { usePathname } from "next/navigation";

export default function HorizontalSideBar() {
  const pathname = usePathname();
  const opacityTransition = "transition-opacity duration-300";

  return (
    <div className="flex flex-col justify-end bg-black rounded-tl-lg rounded-tr-lg shadow-sm min-w-full">
      <div className="text-app-color h-full pt-2 px-3">
        <nav className="flex flex-row gap-1">
          {constants.SideBarMenuItemsConfig.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                `flex flex-col justify-center items-center gap-3
                  p-3 rounded-tl-md rounded-tr-md transition cursor-pointer min-w-5 w-full
                  ${
                    pathname === item.href
                      ? "bg-white text-black border-b-4 border-b-green-500"
                      : "hover:bg-gray-800"
                  }
                `,
                "max-sm:gap-0",
              )}
            >
              <img
                src={item.icon}
                alt={item.title}
                title={item.title}
                className="h-5 w-5"
              />
              <span
                className={cn(
                  "text-sm whitespace-nowrap",
                  opacityTransition,
                  "max-sm:opacity-0 max-sm:h-0",
                  "sm:opacity-100",
                )}
              >
                {item.title}
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
