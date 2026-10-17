import type { AbstractIntlMessages } from "next-intl";
import type { ReactNode } from "react";

export interface IProvidersProps {
  children: ReactNode;
}

export interface IProvidersClientProps {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}
