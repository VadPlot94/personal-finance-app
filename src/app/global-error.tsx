"use client";

import type { AbstractIntlMessages } from "next-intl";
import { useEffect, useState } from "react";
import { geistMono, publicSans } from "@/app/fonts";
import ErrorView from "@/front-end/components/error-view/error-view";
import type { IErrorViewProps } from "@/front-end/components/error-view/types";
import I18nTranslationProvider from "@/front-end/components/i18n-translation-provider/i18n-translation-provider";
import { useLocaleCookie } from "@/front-end/hooks/use-locale-cookie";
import translationService from "@/shared/services/translation.service";
import "./globals.css";

export default function GlobalError(props: IErrorViewProps) {
  const locale = useLocaleCookie();
  const [messages, setMessages] = useState<AbstractIntlMessages>(
    translationService.DefaultMessages,
  );

  useEffect(() => {
    void translationService.getMessages(locale).then(setMessages);
  }, [locale]);

  return (
    <html lang={locale}>
      <body
        className={`${publicSans.variable} ${geistMono.variable} antialiased`}
      >
        <title>Something went wrong | Personal Finance App</title>
        <I18nTranslationProvider locale={locale} messages={messages}>
          <ErrorView {...props} logArea="[global-error]" />
        </I18nTranslationProvider>
      </body>
    </html>
  );
}
