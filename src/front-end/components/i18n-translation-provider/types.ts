import type { AbstractIntlMessages } from "next-intl";
import type { ReactNode } from "react";

export interface II18nTranslationProviderProps {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}
