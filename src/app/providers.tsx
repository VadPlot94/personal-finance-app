import { getLocale, getMessages } from "next-intl/server";
import ProvidersClient from "@/app/providers-client";
import type { IProvidersProps } from "@/app/types";

export default async function Providers({ children }: IProvidersProps) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ProvidersClient locale={locale} messages={messages}>
      {children}
    </ProvidersClient>
  );
}
