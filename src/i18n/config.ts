export const locales = ["en", "ur", "ar"] as const;

export type Locale = (typeof locales)[number];
export type TextDirection = "ltr" | "rtl";

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function getTextDirection(locale: Locale): TextDirection {
  return locale === "en" ? "ltr" : "rtl";
}

export function getLocalizedPath(locale: Locale, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}
