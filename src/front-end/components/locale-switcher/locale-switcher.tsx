"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { setLocaleSRF } from "@/back-end/server-actions/locale-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/front-end/components/ui/select";
import { i18nConfig, type Locale } from "@/shared/i18n/config";

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const handleLocaleChange = async (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    const success = await setLocaleSRF(nextLocale);
    if (!success) {
      toast.error("Error", {
        description: "Failed to change language",
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
        aria-label="Language"
        className="border-gray-300 w-fit cursor-pointer justify-start gap-1 px-2.5"
      >
        <SelectValue placeholder={i18nConfig.defaultLocale.toUpperCase()} />
      </SelectTrigger>
      <SelectContent align="end">
        {i18nConfig.locales.map((i18nLocale) => (
          <SelectItem
            key={i18nLocale}
            value={i18nLocale}
            className="cursor-pointer"
          >
            <span>{i18nLocale.toUpperCase()}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
