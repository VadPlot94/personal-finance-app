"use server";
import "server-only";

import { cookies } from "next/headers";
import { i18nConfig, type Locale } from "@/shared/i18n/config";
import logger from "@/shared/services/logger.service";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function setLocaleSRF(locale: string): Promise<boolean> {
  try {
    if (!i18nConfig.locales.includes(locale as Locale)) {
      return false;
    }

    const store = await cookies();
    store.set(i18nConfig.localeCookieName, locale, {
      path: "/",
      sameSite: "lax",
      maxAge: ONE_YEAR_SECONDS,
    });

    return true;
  } catch (error) {
    logger.logError("[locale] Failed to set locale cookie:", error);
    return false;
  }
}
