import { getLocalizedPath, isLocale } from "@/i18n/config";

export function getSafeAuthNextPath(
  value: string | null,
  localeValue: string
): string {
  const locale = isLocale(localeValue) ? localeValue : "en";
  const fallback = getLocalizedPath(locale, "/");
  const localeRoot = `/${locale}`;

  if (!value || value.includes("\\")) return fallback;

  try {
    const internalOrigin = "https://academy.invalid";
    const destination = new URL(value, internalOrigin);

    if (
      destination.origin === internalOrigin &&
      (destination.pathname === localeRoot ||
        destination.pathname.startsWith(`${localeRoot}/`))
    ) {
      return `${destination.pathname}${destination.search}${destination.hash}`;
    }
  } catch {
    return fallback;
  }

  return fallback;
}
