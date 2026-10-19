import { type AbstractIntlMessages, createTranslator } from "next-intl";
import enUSMessages from "@/i18n/messages/en-US.json";
import logger from "@/shared/services/logger.service";
import type { Translator } from "@/shared/services/types";

class TranslationService {
  public readonly Locales = ["en-US", "ru-RU"] as const;
  public readonly DefaultLocale = this.Locales[0];
  public readonly LocaleCookieName = "locale" as const;
  public readonly DefaultMessages: AbstractIntlMessages = enUSMessages;

  private readonly messageParamsSeparator = "::";
  private readonly defaultLocaleTranslator: Translator = (() => {
    const t = createTranslator({
      locale: this.DefaultLocale,
      messages: this.DefaultMessages,
    });
    return ((key, values) =>
      values === undefined
        ? t(key as never)
        : t(key as never, values as never)) as Translator;
  })();

  public isValidLocale(locale: string): locale is Locale {
    return (this.Locales as readonly string[]).includes(locale);
  }

  public async getMessages(locale: string): Promise<AbstractIntlMessages> {
    const safeLocale = this.isValidLocale(locale) ? locale : this.DefaultLocale;

    if (safeLocale === this.DefaultLocale) {
      return this.DefaultMessages;
    }

    return (await import(`@/i18n/messages/${safeLocale}.json`)).default;
  }

  /**
   * Resolves wire messages (`i18n.*` keys, optional `::{params}`) through a
   * next-intl translator. Non-`i18n.` strings are returned unchanged.
   *
   * Wire format:
   * - bare key: `i18n.Common.Ok`
   * - key with ICU params (from {@link joinKeyWithParams}):
   *   `i18n.Common.DeleteTitle::{"name":"Food"}`
   *
   * When `t` is omitted, keys are returned as-is (identity translator).
   *
   * @example String success / error message from a server action
   * ```ts
   * translationService.translate(t, response.message, "i18n.Common.Ok");
   * // → "OK" (or localized equivalent)
   *
   * translationService.translate(t, response.error, "i18n.Common.UnknownError");
   * // null/undefined/"" → fallback key is translated
   * ```
   *
   * @example Plain text (no `i18n.` prefix) passes through
   * ```ts
   * translationService.translate(t, "Already saved");
   * // → "Already saved"
   * ```
   *
   * @example Field errors map (e.g. zodErrors) — same keys, translated values
   * ```ts
   * translationService.translate(t, {
   *   name: "i18n.Validation.Required",
   *   amount: 'i18n.Validation.Min::{"min":1}',
   * });
   * // → { name: "Required", amount: "Must be at least 1" }
   * ```
   *
   * @example Without a translator (logs / SSR fallbacks)
   * ```ts
   * translationService.translate(undefined, "i18n.Common.Error");
   * // → "i18n.Common.Error"
   * ```
   */
  public translate(
    t: Translator | undefined,
    input: Record<string, string>,
  ): Record<string, string>;
  public translate(
    t: Translator | undefined,
    input: string | null | undefined,
    fallbackKey?: string,
  ): string;
  public translate(
    t: Translator | undefined,
    input: string | null | undefined | Record<string, string>,
    fallbackKey?: string,
  ): string | Record<string, string> {
    const translator: Translator = t ?? ((key: string) => key);
    const isRecord = this.isMessageRecord(input);
    const record: Record<string, string> = isRecord
      ? input
      : { "": input || fallbackKey || "" };

    const translated = Object.fromEntries(
      Object.entries(record).map(([field, message]) => [
        field,
        message ? this.translateByKeyWithParams(translator, message) : "",
      ]),
    );

    return isRecord ? translated : translated[""];
  }

  public translateToDefaultLocale(message: string): string {
    return this.translate(this.defaultLocaleTranslator, message);
  }

  public joinKeyWithParams(
    key: string,
    params: Record<string, string | number>,
  ): string {
    if (!this.isValidMessageParams(params)) {
      const errorMessage = `[i18n] joinKeyWithParams requires a non-empty params object with string|number values for key "${key}"`;
      logger.logError(errorMessage, params);
      throw new Error(errorMessage);
    }
    return `${key}${this.messageParamsSeparator}${JSON.stringify(params)}`;
  }

  private translateByKeyWithParams(t: Translator, message: string): string {
    if (!message.startsWith("i18n.")) {
      return message;
    }

    const separatorIndex = message.indexOf(this.messageParamsSeparator);
    if (separatorIndex === -1) {
      return t(message);
    }

    const key = message.slice(0, separatorIndex);
    const valuesJson = message.slice(
      separatorIndex + this.messageParamsSeparator.length,
    );

    try {
      const values = JSON.parse(valuesJson) as Record<string, string | number>;
      return t(key, values);
    } catch {
      return t(key);
    }
  }

  private isMessageRecord(
    input: string | null | undefined | Record<string, string>,
  ): input is Record<string, string> {
    return input != null && typeof input === "object" && !Array.isArray(input);
  }

  private isValidMessageParams(
    params: Record<string, string | number>,
  ): boolean {
    if (params == null || typeof params !== "object" || Array.isArray(params)) {
      return false;
    }

    const entries = Object.entries(params);
    if (entries.length === 0) {
      return false;
    }

    return entries.every(([paramKey, paramValue]) => {
      if (!paramKey) {
        return false;
      }
      if (typeof paramValue === "string") {
        return true;
      }
      return typeof paramValue === "number" && Number.isFinite(paramValue);
    });
  }
}

const translationService = new TranslationService();
export type Locale = (typeof translationService.Locales)[number];
export default translationService;
