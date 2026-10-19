import "server-only";

import { cookies } from "next/headers";
import translationService, {
  type Locale,
} from "@/shared/services/translation.service";

type CookieStore = Awaited<ReturnType<typeof cookies>>;
type CookieSetOptions = NonNullable<Parameters<CookieStore["set"]>[2]>;

const OneYearInSeconds = 60 * 60 * 24 * 365;

class CookiesService {
  public async getStore(): Promise<CookieStore> {
    return cookies();
  }

  public async get(name: string): Promise<string | undefined> {
    const store = await this.getStore();
    return store.get(name)?.value;
  }

  public async set(
    name: string,
    value: string,
    options?: CookieSetOptions,
  ): Promise<void> {
    const store = await this.getStore();
    store.set(name, value, options);
  }

  public async getLocale(): Promise<Locale | null> {
    const value = await this.get(translationService.LocaleCookieName);
    return value && translationService.isValidLocale(value) ? value : null;
  }

  public async setLocale(locale: Locale): Promise<void> {
    await this.set(translationService.LocaleCookieName, locale, {
      path: "/",
      sameSite: "lax",
      maxAge: OneYearInSeconds,
    });
  }
}

const cookiesService = new CookiesService();
export default cookiesService;
