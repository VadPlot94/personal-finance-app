const defaultLocale = "en";
const locales = [defaultLocale, "ru"] as const;

export type Locale = (typeof locales)[number];

export const i18nConfig = {
  defaultLocale,
  locales,
  localeCookieName: "locale",
};
