"use client";

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { IProvidersClientProps } from "@/app/types";

export default function ProvidersClient({
  children,
  locale,
  messages,
}: IProvidersClientProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider>{children}</SessionProvider>
    </NextIntlClientProvider>
  );
}
