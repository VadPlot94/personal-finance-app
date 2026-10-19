import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import translationService from "@/shared/services/translation.service";
import type { IFormActionResult, Translator } from "@/shared/services/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function orEmptyStr(value?: string | null): string {
  return value || "";
}

export function removeUndefinedFields<T>(obj: T): Partial<T> {
  const cleanedObj: Partial<T> = { ...obj };
  Object.keys(cleanedObj).forEach((key) => {
    const value = cleanedObj[key as keyof Partial<T>];
    if (value === undefined || value === null) {
      delete cleanedObj[key as keyof Partial<T>];
    }
  });
  return cleanedObj;
}

export function handleDialogFormActionResult(
  formResultState: IFormActionResult | null,
  isPending: boolean,
  onOpenChange: (isOpen: boolean) => void,
  setFormErrors?: (errors: Record<string, string>) => void,
  t?: Translator,
): void {
  if (!formResultState) {
    return;
  }

  const isFormSavedSuccess = formResultState.success && !isPending;
  const translate: Translator = t ?? ((key: string) => key);

  if (isFormSavedSuccess) {
    toast.success(translate("i18n.Common.Success"), {
      description: translationService.translate(
        translate,
        formResultState.message,
        "i18n.Common.Ok",
      ),
    });
  } else if (formResultState.zodErrors && setFormErrors) {
    setFormErrors(
      translationService.translate(translate, formResultState.zodErrors),
    );
  } else {
    toast.error(translate("i18n.Common.Error"), {
      description: translationService.translate(
        translate,
        formResultState.error,
        "i18n.Common.UnknownError",
      ),
    });
  }

  onOpenChange(!isFormSavedSuccess);
}
