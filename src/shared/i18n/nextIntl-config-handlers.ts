import { type IntlError, IntlErrorCode } from "next-intl";
import logger from "@/shared/services/logger.service";

/**
 * Shared next-intl error handlers used on both sides of the app:
 * - Server: `src/i18n/nextIntlPlugin/requestI18nServerConfig.ts` (`getRequestConfig`)
 * - Client: `I18nTranslationProvider` → `NextIntlClientProvider`
 *
 * One implementation keeps logging and message-fallback behavior aligned between RSC and the browser.
 */

/**
 * Handles next-intl runtime errors (`onError` / `onError` provider prop).
 *
 * **Why:** next-intl reports missing keys, invalid rich-text messages, etc. as `IntlError`.
 * Without a handler, defaults may spam the console or surface less useful diagnostics.
 *
 * **MISSING_MESSAGE:** intentionally ignored. Incomplete catalogs are common during development
 * and locale rollouts; missing keys already fall through to {@link getIntlMessageFallback}.
 * Logging every miss would flood logs without adding signal.
 *
 * **Other codes** (e.g. `INVALID_MESSAGE`, formatting failures): logged via `logger` with an
 * `[i18n]` prefix so real misconfiguration (ICU / rich tags / bad params) stays visible.
 *
 * @param error - Error raised by next-intl while resolving or formatting a message.
 */
export function onIntlError(error: IntlError): void {
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    return;
  }
  logger.logError("[i18n] Intl error:", error);
}

/**
 * Builds a human-visible string when a translation key cannot be resolved
 * (`getMessageFallback` in request config / client provider).
 *
 * **Why:** if a key is missing, next-intl needs something to show instead of crashing or
 * rendering blank UI. Returning a dotted path (`Namespace.Key` or just `Key`) makes the gap
 * obvious in the UI while still keeping the page usable.
 *
 * This pairs with {@link onIntlError}: missing keys stay quiet in logs but remain discoverable
 * on screen via this fallback label.
 *
 * @param args.namespace - Optional message namespace (when using nested / namespaced keys).
 * @param args.key - Message key that failed to resolve.
 * @param args.error - Underlying `IntlError` (part of next-intl's fallback callback signature;
 *   not used for the returned string).
 * @returns Dotted fallback label, e.g. `"i18n.Common.Ok"` or `"Common.Ok"`.
 */
export function getIntlMessageFallback({
  namespace,
  key,
}: {
  namespace?: string;
  key: string;
  error: IntlError;
}): string {
  return [namespace, key].filter(Boolean).join(".");
}
