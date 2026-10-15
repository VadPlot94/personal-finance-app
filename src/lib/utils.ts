import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
