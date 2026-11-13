"use client";

import { useEffect, useState } from "react";
import type { ISidebarVisibilityShellProps } from "@/front-end/components/sidebar-visibility-shell/types";
import { cn } from "@/lib/utils";

const MD_MIN_WIDTH_QUERY = "(min-width: 768px)";

// Purpose: keep the CSS opacity fade between vertical/horizontal sidebars, while
// excluding the visually hidden one from keyboard focus and the accessibility tree.
//
// Why this shell exists: layout fades menus with opacity / w-0 / h-0 so the
// switch at the md breakpoint animates. Those styles only change visuals — the
// inactive menu stays in the DOM, still focusable and announced by assistive tech.
//
// Why CSS alone is not enough: `display: none` / `hidden` would fix a11y but
// kills the opacity transition (display is not animatable). `pointer-events-none`
// blocks clicks only. `visibility: hidden` / `aria-hidden` are incomplete or
// unsafe while focusable descendants remain. The HTML `inert` attribute does
// what we need (no focus, no a11y tree), but it cannot be toggled from a media
// query — it must be set in the DOM, so a small client shell listens to
// matchMedia(md) and applies `inert` to the inactive variant.

export default function SidebarVisibilityShell({
  children,
  className,
  variant,
}: ISidebarVisibilityShellProps) {
  const [isMdUp, setIsMdUp] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MD_MIN_WIDTH_QUERY);
    const syncMatch = () => {
      setIsMdUp(mediaQuery.matches);
    };

    syncMatch();
    mediaQuery.addEventListener("change", syncMatch);
    return () => {
      mediaQuery.removeEventListener("change", syncMatch);
    };
  }, []);

  const isInert =
    isMdUp !== null && (variant === "vertical" ? !isMdUp : isMdUp);

  return (
    <div className={cn(className)} inert={isInert || undefined}>
      {children}
    </div>
  );
}
