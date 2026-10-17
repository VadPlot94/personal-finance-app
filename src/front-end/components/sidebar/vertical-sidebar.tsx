"use client";

import type { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import constants from "@/shared/services/constants.service";

export default function VerticalSidebar() {
  // !Avoid: Hydration mismatch error!
  // first server HTML and first client render must match
  // Reason (first render):
  //   usePathname() and useSession() are nulls on HTML on server side
  //   on client side when Hydration in progress with first render it already filled with data
  // Purpose: first render should be equal between Server and Client
  // Solution: do not get path/session for UI on first render
  // → useState(null|placeholder) + useEffect after mount.
  // Note: Client also renders on Server, so we need to handle this case.
  const pathname = usePathname();
  const session = useSession();
  const t = useTranslations();

  const [isMenuOpened, toggleMenu] = useState(false);
  const [sessionUserData, setSessionUserData] = useState<User | null>(null);
  const [activePath, setActivePath] = useState<string | null>(null);

  const menuItemWidth = isMenuOpened ? "w-40" : "w-fit";
  const transition = "transition-all duration-500 ease-in-out";
  const menuTransition = "transition-all duration-400 ease-in-out delay-500";
  const opacityTransition = "transition-opacity duration-300";

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  useEffect(() => {
    setSessionUserData(session?.data?.user as User);
  }, [session?.status, session?.data?.user]);

  const handleSignOutClick = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  const financeLabel = t("i18n.Navigation.Finance");
  const userLabel = sessionUserData?.name || t("i18n.Navigation.User");
  const menuToggleLabel = t(
    isMenuOpened
      ? "i18n.Navigation.MinimizeMenu"
      : "i18n.Navigation.MaximizeMenu",
  );
  const signOutLabel = t("i18n.Navigation.SignOut");

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
          <div className="flex flex-col items-center h-45 justify-center w-full">
            <div
              className={cn(
                "flex flex-col gap-7 justify-center items-center",
                menuItemWidth,
              )}
            >
              <img
                className={cn(
                  opacityTransition,
                  isMenuOpened ? "opacity-100" : "opacity-0 h-0",
                )}
                src="assets/images/logo-large.svg"
                alt={financeLabel}
                title={financeLabel}
              />
              <img
                className={cn(
                  opacityTransition,
                  "h-8",
                  isMenuOpened ? "opacity-0 h-0" : "opacity-100",
                )}
                src="assets/images/logo-small.svg"
                alt={financeLabel}
                title={financeLabel}
              />
              <div
                className={cn(
                  "flex flex-row items-center justify-center w-full",
                  menuTransition,
                  isMenuOpened ? "gap-3" : "gap-0",
                )}
              >
                <img
                  className={cn(
                    opacityTransition,
                    "h-10 w-10 rounded-full object-cover ring-1 ring-gray-200",
                  )}
                  src={
                    sessionUserData?.image || constants.DefaultUserAvatarIconUrl
                  }
                  alt={userLabel}
                  title={userLabel}
                />
                <div
                  className={cn(
                    opacityTransition,
                    "whitespace-nowrap",
                    isMenuOpened
                      ? "opacity-100 translate-x-0 w-30"
                      : "opacity-0 -translate-x-20 max-w-0",
                  )}
                >
                  {userLabel}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <nav className="flex flex-col gap-3">
              {constants.SideBarNavMenuItemsConfig.map((item) => {
                const label = t(item.titleI18nKey);
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    title={label}
                    className={`flex flex-col justify-center items-center
                  p-3 rounded-tr-md rounded-br-md cursor-pointer w-full
                  ${
                    activePath === item.href
                      ? "bg-white text-black"
                      : "hover:bg-gray-800"
                  }
                `}
                  >
                    <div
                      className={cn(
                        "flex flex-row",
                        isMenuOpened
                          ? "items-start justify-start gap-3"
                          : "h-6",
                        menuItemWidth,
                      )}
                    >
                      <img src={item.iconUrl} alt={label} className="h-5 w-5" />
                      <span
                        className={cn(
                          transition,
                          "origin-left whitespace-nowrap",
                          isMenuOpened
                            ? "opacity-100 translate-x-0 w-30"
                            : "opacity-0 -translate-x-20 max-w-0",
                        )}
                      >
                        {label}
                      </span>
                    </div>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
        <button
          type="button"
          className="flex flex-col items-center h-10 justify-center cursor-pointer w-full hover:bg-gray-800 rounded-tr-md rounded-br-md"
          onClick={() => toggleMenu(!isMenuOpened)}
          title={menuToggleLabel}
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
                alt=""
                aria-hidden="true"
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
                {menuToggleLabel}
              </div>
            </div>
          </div>
        </button>
        <button
          type="button"
          className="flex flex-col items-center h-10 justify-center cursor-pointer w-full hover:bg-gray-800 rounded-tr-md rounded-br-md"
          onClick={() => {
            void handleSignOutClick();
          }}
          title={signOutLabel}
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
                src={constants.SignOutMenuItemConfig.iconUrl}
                alt=""
                aria-hidden="true"
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
                {t(constants.SignOutMenuItemConfig.titleI18nKey)}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
