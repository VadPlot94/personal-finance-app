"use server";
import "server-only";

import cookiesService from "@/back-end/services/cookies.service";
import logger from "@/shared/services/logger.service";
import translationService from "@/shared/services/translation.service";

export async function setLocaleSRF(locale: string): Promise<boolean> {
  try {
    if (!translationService.isValidLocale(locale)) {
      return false;
    }

    await cookiesService.setLocale(locale);
    return true;
  } catch (error) {
    logger.logError("[locale] Failed to set locale cookie:", error);
    return false;
  }
}
