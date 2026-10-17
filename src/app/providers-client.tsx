"use client";

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { IProvidersClientProps } from "@/app/types";
import HtmlLang from "@/front-end/components/html-lang/html-lang";

export default function ProvidersClient({
  children,
  locale,
  messages,
}: IProvidersClientProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLang />
      <SessionProvider>{children}</SessionProvider>
    </NextIntlClientProvider>
  );
}
