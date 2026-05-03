"use client";

import { cn } from "@/lib/utils";
import constants from "@/shared/services/constants.service";
import { ISideBarMenuItem } from "@/shared/services/types";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HorizontalSidebar() {
  const pathname = usePathname();
  const session = useSession();

  const getAccountMenuItem = (sessionUserData?: User): ISideBarMenuItem => {
    const { image, name } = sessionUserData || {};
    return {
      href: "*",
      iconUrl: image || constants.DefaultUserAvatarIconUrl,
      title: name?.split?.(" ")?.[0] || "User",
      isAccount: true,
    };
  };

  const [sideBarItems, setSideBarItems] = useState<ISideBarMenuItem[]>([
    getAccountMenuItem(session?.data?.user),
    ...constants.SideBarMenuItemsConfig,
    constants.SignOutMenuItemConfig,
  ]);

  const opacityTransition = "transition-opacity duration-300";

  useEffect(() => {
    setSideBarItems([
      getAccountMenuItem(session?.data?.user),
      ...constants.SideBarMenuItemsConfig,
      constants.SignOutMenuItemConfig,
    ]);
  }, [session?.status, session?.data?.user]);

  return (
    <div className="flex flex-col justify-end bg-black rounded-tl-lg rounded-tr-lg shadow-sm min-w-full">
      <div className="text-app-color h-full pt-2 px-3">
        <nav className="flex flex-row gap-1">
          {sideBarItems.map((item) => {
            return (
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
                  item.isAccount && "pointer-events-none cursor-default",
                )}
              >
                <img
                  src={item.iconUrl}
                  alt={item.title}
                  title={item.title}
                  className={cn(
                    "h-5 w-5",
                    item.isAccount &&
                      "h-6 w-6 rounded-full object-cover ring-1 ring-gray-200",
                  )}
                />
                <span
                  className={cn(
                    "text-sm whitespace-nowrap",
                    opacityTransition,
                    "max-sm:opacity-0 max-sm:h-0",
                    "sm:opacity-100",
                    item.isAccount && "truncate max-w-24",
                  )}
                >
                  {item.title}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
