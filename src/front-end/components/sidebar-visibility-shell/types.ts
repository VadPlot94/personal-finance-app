import type { ReactNode } from "react";

export interface ISidebarVisibilityShellProps {
  children: ReactNode;
  className?: string;
  variant: "vertical" | "horizontal";
}
