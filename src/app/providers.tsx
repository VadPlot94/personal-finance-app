"use client";

import { SessionProvider } from "next-auth/react";
import type { IProvidersProps } from "@/app/types";

export default function Providers({ children }: IProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
