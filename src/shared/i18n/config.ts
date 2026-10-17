const defaultLocale = "en";
const locales = [defaultLocale] as const;

export type Locale = (typeof locales)[number];

export const i18nConfig = {
  defaultLocale,
  locales,
  localeCookieName: "locale",
};
