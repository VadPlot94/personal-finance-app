"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { setLocaleSRF } from "@/back-end/server-actions/locale-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/front-end/components/ui/select";
import translationService, {
  type Locale,
} from "@/shared/services/translation.service";

function getLocaleShortLabel(locale: string): string {
  return locale.split("-")[0]?.toUpperCase() || locale.toUpperCase();
}

export default function LocaleSwitcher() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();

  const handleLocaleChange = async (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    const success = await setLocaleSRF(nextLocale);
    if (!success) {
      toast.error(t("i18n.Common.Error"), {
        description: t("i18n.Locale.ChangeFailed"),
      });
      return;
    }

    router.refresh();
  };

  return (
    <Select
      name="locale"
      value={locale}
      onValueChange={(value: Locale) => handleLocaleChange(value)}
    >
      <SelectTrigger
        aria-label={t("i18n.Locale.Language")}
        className="border-gray-300 w-fit cursor-pointer justify-start gap-1 px-2.5"
      >
        <SelectValue
          placeholder={getLocaleShortLabel(translationService.DefaultLocale)}
        />
      </SelectTrigger>
      <SelectContent align="end">
        {translationService.Locales.map((i18nLocale) => (
          <SelectItem
            key={i18nLocale}
            value={i18nLocale}
            className="cursor-pointer"
          >
            <span>{getLocaleShortLabel(i18nLocale)}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
