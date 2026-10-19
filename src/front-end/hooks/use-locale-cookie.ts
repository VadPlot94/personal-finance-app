"use client";

import { useSyncExternalStore } from "react";
import translationService, {
  type Locale,
} from "@/shared/services/translation.service";

function readLocaleCookie(): Locale {
  if (typeof document === "undefined") {
    return translationService.DefaultLocale;
  }

  const cookieEntry = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${translationService.LocaleCookieName}=`));
  const cookieValue = cookieEntry?.split("=")[1];

  return cookieValue && translationService.isValidLocale(cookieValue)
    ? cookieValue
    : translationService.DefaultLocale;
}

function subscribeToCookieStore(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("focus", onStoreChange);
  return () => window.removeEventListener("focus", onStoreChange);
}

export function useLocaleCookie(): Locale {
  return useSyncExternalStore(
    subscribeToCookieStore,
    readLocaleCookie,
    () => translationService.DefaultLocale,
  );
}
