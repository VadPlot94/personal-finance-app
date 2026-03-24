"use client";

import { cn } from "@/lib/utils";
import constants from "@/services/constants.service";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function VerticalSideBar() {
  const pathname = usePathname();
  const [isMenuOpened, toggleMenu] = useState(false);

  const menuItemWidth = isMenuOpened ? "w-40" : "w-fit";
  const transition = "transition-all duration-500 ease-in-out";
  const menuTransition = "transition-all duration-400 ease-in-out delay-500";
  const opacityTransition = "transition-opacity duration-300";

  return (
    <div
      className={cn(
        `sticky top-8 self-start bg-black rounded-br-lg
        rounded-tr-lg min-w-20 shadow-sm h-[calc(100vh-2rem)] max-h-screen
        [@media(max-height:500px)]:static [@media(max-height:500px)]:min-h-full`,
        menuTransition,
        isMenuOpened ? "min-w-70" : "min-w-20",
      )}
    >
      <div className="flex flex-col gap-6 items-center justify-evenly text-app-color h-full mr-2 [@media(max-height:500px)]:max-h-105">
        <div className="w-full">
          <div className="flex flex-col items-center h-25 justify-center w-full">
            <div className={menuItemWidth}>
              <img
                className={cn(
                  opacityTransition,
                  isMenuOpened ? "opacity-100" : "opacity-0 h-0",
                )}
                src="assets/images/logo-large.svg"
                alt="Finance"
                title="Finance"
              />
              <img
                className={cn(
                  opacityTransition,
                  isMenuOpened ? "opacity-0 h-0" : "opacity-100",
                )}
                src="assets/images/logo-small.svg"
                alt="Finance"
                title="Finance"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <nav className="flex flex-col gap-3">
              {constants.SideBarMenuItemsConfig.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col justify-center items-center
                  p-3 rounded-tr-md rounded-br-md cursor-pointer w-full
                  ${
                    pathname === item.href
                      ? "bg-white text-black"
                      : "hover:bg-gray-800"
                  }
                `}
                >
                  <div
                    className={cn(
                      "flex flex-row",
                      isMenuOpened ? "items-start justify-start gap-3" : "h-6",
                      menuItemWidth,
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
                        transition,
                        "origin-left whitespace-nowrap",
                        isMenuOpened
                          ? "opacity-100 translate-x-0 w-30"
                          : "opacity-0 -translate-x-20 max-w-0",
                      )}
                    >
                      {item.title}
                    </span>
                  </div>
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div
          className="flex flex-col items-center h-10 justify-center cursor-pointer w-full hover:bg-gray-800 rounded-tr-md rounded-br-md"
          onClick={() => toggleMenu(!isMenuOpened)}
        >
          <div
            className={cn(
              "flex flex-col items-center justify-center h-10 cursor-pointer",
              menuItemWidth,
            )}
          >
            <div
              className={cn(
                "flex flex-row items-center justify-start w-full",
                isMenuOpened ? "gap-3" : "gap-0",
              )}
            >
              <img
                className="h-5 w-5"
                src={
                  isMenuOpened
                    ? "assets/images/icon-minimize-menu.svg"
                    : "assets/images/icon-maximize-menu.svg"
                }
              />
              <div
                className={cn(
                  transition,
                  "origin-left whitespace-nowrap",
                  isMenuOpened
                    ? "opacity-100 translate-x-0 w-30"
                    : "opacity-0 -translate-x-20 max-w-0",
                )}
              >
                Minimize Menu
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
