import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { i18nConfig, type Locale } from "@/shared/i18n/config";

export default getRequestConfig(async () => {
  const currentLocale =
    (await getLocaleFromCookies()) ?? i18nConfig.defaultLocale;

  return {
    locale: currentLocale,
    messages: (await import(`../../../messages/${currentLocale}.json`)).default,
  };
});

async function getLocaleFromCookies(): Promise<Locale | null> {
  const store = await cookies();
  const currentLocale = store.get(i18nConfig.localeCookieName)?.value as Locale;
  return i18nConfig.locales.includes(currentLocale) ? currentLocale : null;
}
