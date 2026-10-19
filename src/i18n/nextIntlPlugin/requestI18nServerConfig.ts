import { getRequestConfig } from "next-intl/server";
import cookiesService from "@/back-end/services/cookies.service";
import {
  getIntlMessageFallback,
  onIntlError,
} from "@/shared/i18n/nextIntl-config-handlers";
import translationService from "@/shared/services/translation.service";

export default getRequestConfig(async () => {
  const currentLocale =
    (await cookiesService.getLocale()) ?? translationService.DefaultLocale;

  return {
    locale: currentLocale,
    messages: await translationService.getMessages(currentLocale),
    onError: onIntlError,
    getMessageFallback: getIntlMessageFallback,
  };
});
