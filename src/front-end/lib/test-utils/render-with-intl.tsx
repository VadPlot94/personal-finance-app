import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import translationService from "@/shared/services/translation.service";

interface IRenderWithIntlOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: string;
  messages?: AbstractIntlMessagesLike;
}

type AbstractIntlMessagesLike = typeof translationService.DefaultMessages;

export function renderWithIntl(
  ui: ReactElement,
  options: IRenderWithIntlOptions = {},
) {
  const {
    locale = translationService.DefaultLocale,
    messages = translationService.DefaultMessages,
    ...renderOptions
  } = options;

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
