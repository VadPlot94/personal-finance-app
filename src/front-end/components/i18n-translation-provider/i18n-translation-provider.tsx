"use client";

import { NextIntlClientProvider } from "next-intl";
import type { II18nTranslationProviderProps } from "@/front-end/components/i18n-translation-provider/types";
import {
  getIntlMessageFallback,
  onIntlError,
} from "@/shared/i18n/nextIntl-config-handlers";

export default function I18nTranslationProvider({
  children,
  locale,
  messages,
}: II18nTranslationProviderProps) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={onIntlError}
      getMessageFallback={getIntlMessageFallback}
    >
      {children}
    </NextIntlClientProvider>
  );
}
