"use client";

import { SessionProvider } from "next-auth/react";
import type { IProvidersClientProps } from "@/app/types";
import HtmlLang from "@/front-end/components/html-lang/html-lang";
import I18nTranslationProvider from "@/front-end/components/i18n-translation-provider/i18n-translation-provider";

export default function ProvidersClient({
  children,
  locale,
  messages,
}: IProvidersClientProps) {
  return (
    <I18nTranslationProvider locale={locale} messages={messages}>
      <HtmlLang />
      <SessionProvider>{children}</SessionProvider>
    </I18nTranslationProvider>
  );
}
